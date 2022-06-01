import { useGetAllOrganizations } from "@/api/organizations";
import { useRestAPI } from "@/api/restapi";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { ContentItemDetails } from "@/types/objectTypes";
import {
    FullScreenDialog,
    PageTable,
    useSnackbar,
    utils,
} from "@kl-engineering/kidsloop-px";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import { Info as InfoIcon } from "@mui/icons-material";
import {
    alpha,
    Avatar,
    Box,
    Divider,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Toolbar,
    Tooltip,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import { isEqual } from "lodash";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    paperRoot: {
        width: `100%`,
    },
    organizationsPaper: {
        marginTop: theme.spacing(1),
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        color: `white`,
        marginRight: 16,
        fontSize: 10,
    },
    tableOverlayContainer: {
        position: `relative`,
    },
    table: {
        position: `absolute`,
    },
    disabledOverlay: {
        backgroundColor: alpha(theme.palette.grey[500], 0.66),
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        borderRadius: `inherit`,
    },
}));

enum DistributeStatus {
    PRESET = `{share_all}`,
    SELECTED = `selected`,
}

interface OrganizationRow {
    id: string;
    name: string;
    phone: string;
}

interface Props {
    open: boolean;
    value?: ContentItemDetails;
    onClose: () => void;
}

export default function (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const restApi = useRestAPI();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const [ initSelectedOrganizationIds, setInitSelectedOrganizationIds ] = useState<string[]>();
    const [ selectedOrganizationIds, setSelectedOrganizationIds ] = useState<string[]>([]);
    const [ finalOrganizationIds, setFinalOrganizationIds ] = useState<string[]>([]);
    const { data: dataOrganizations, loading: loadingGetOrganizations } = useGetAllOrganizations();
    const [ loadingGetFolderDistributeStatus, setLoadingGetFolderDistributeStatus ] = useState(false);
    const [ distributeStatus, setDistributeStatus ] = useState<DistributeStatus>(DistributeStatus.PRESET);
    const [ rows, setRows ] = useState<OrganizationRow[]>([]);

    const organizationId = currentOrganization?.id ?? ``;

    const getFolderDistributeStatus = async () => {
        setLoadingGetFolderDistributeStatus(true);
        try {
            const folderDistributeStatus = await restApi.getFoldersShare({
                folder_ids: value?.id ?? ``,
                metaLoading: true,
                org_id: organizationId,
            });
            const organizationsIds = folderDistributeStatus.data?.flatMap((d) => d.orgs.map((org) => org.id)) ?? [];
            organizationsIds.sort((a, b) => a.localeCompare(b));
            const isDistributeStatusPreset = organizationsIds.length === 1 && organizationsIds[0] === DistributeStatus.PRESET;
            setSelectedOrganizationIds(isDistributeStatusPreset ? [] : organizationsIds);
            setDistributeStatus(isDistributeStatusPreset ? DistributeStatus.PRESET : DistributeStatus.SELECTED);
            if (!initSelectedOrganizationIds) setInitSelectedOrganizationIds(organizationsIds);
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
                variant: `error`,
            });
        }
        setLoadingGetFolderDistributeStatus(false);
    };

    const putFolderDistributeStatus = async () => {
        try {
            await restApi.putFoldersShare({
                folder_ids: [ value?.id ?? `` ],
                org_id: organizationId,
                org_ids: finalOrganizationIds,
            });
            enqueueSnackbar(intl.formatMessage({
                id: `library_distributeEditSuccess`,
            }), {
                variant: `success`,
            });
            onClose();
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleSelected = (selectedIds: string[]) => {
        selectedIds.sort((a, b) => a.localeCompare(b));
        setSelectedOrganizationIds(selectedIds);
    };

    const handleDistributeStatusChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setDistributeStatus(value as DistributeStatus);
    };

    useEffect(() => {
        if (!open || !value || !currentOrganization) return;
        getFolderDistributeStatus();
    }, [
        open,
        value,
        currentOrganization,
    ]);

    useEffect(() => {
        const rows: OrganizationRow[] = dataOrganizations?.organizations
            ?.filter((organization) => organization.status === Status.ACTIVE && organization?.organization_id !== organizationId)
            .map((organization) => ({
                id: organization?.organization_id ?? ``,
                name: organization?.organization_name ?? ``,
                phone: organization?.phone ?? ``,
            })) ?? [];
        setRows(rows);
    }, [ dataOrganizations, currentOrganization ]);

    useEffect(() => {
        setSelectedOrganizationIds([]);
        setDistributeStatus(DistributeStatus.PRESET);
        setInitSelectedOrganizationIds(undefined);
    }, [ open ]);

    useEffect(() => {
        const organizationIds = distributeStatus === DistributeStatus.PRESET ? [ DistributeStatus.PRESET ] : selectedOrganizationIds;
        setFinalOrganizationIds(organizationIds);

    }, [
        distributeStatus,
        selectedOrganizationIds,
        initSelectedOrganizationIds,
    ]);

    const columns: TableColumn<OrganizationRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `library_nameLabel`,
            }),
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <Avatar
                        variant="rounded"
                        className={classes.avatar}
                        style={{
                            color: `white`,
                            backgroundColor: utils.stringToColor(row.name),
                        }}
                    >
                        {utils.nameToInitials(row.name, 4)}
                    </Avatar>
                    <span>{row.name}</span>
                </Box>
            ),
        },
        {
            id: `phone`,
            label: intl.formatMessage({
                id: `library_phoneLabel`,
            }),
        },
    ];

    return (<FullScreenDialog
        open={open}
        title={`Distribute "${value?.name ?? ``}"`}
        action={{
            label: `Save`,
            disabled: !initSelectedOrganizationIds || isEqual(finalOrganizationIds, initSelectedOrganizationIds),
            onClick: putFolderDistributeStatus,
        }}
        style={{
            backgroundColor: `red`,
        }}
        onClose={onClose}
    >
        <RadioGroup
            aria-label="gender"
            name="gender1"
            value={distributeStatus}
            onChange={handleDistributeStatusChange}
        >
            <Paper className={classes.paperRoot}>
                <Toolbar>
                    <FormControlLabel
                        value={DistributeStatus.PRESET}
                        control={<Radio />}
                        label="Preset"
                    />
                    <Tooltip
                        arrow
                        title={intl.formatMessage({
                            id: `library_distributeTooltip`,
                        })}
                        placement="right"
                    >
                        <InfoIcon
                            color="action"
                            fontSize="small"
                        />
                    </Tooltip>
                </Toolbar>
            </Paper>
            <Paper className={clsx(classes.paperRoot, classes.organizationsPaper)}>
                <Toolbar>
                    <FormControlLabel
                        value={DistributeStatus.SELECTED}
                        control={<Radio />}
                        label={intl.formatMessage({
                            id: `library_selectOrganizations`,
                        })}
                    />
                </Toolbar>
                {distributeStatus === DistributeStatus.SELECTED && <>
                    <Divider />
                    <PageTable
                        showSelectables
                        idField="id"
                        orderBy="name"
                        loading={loadingGetFolderDistributeStatus || loadingGetOrganizations}
                        rows={rows}
                        columns={columns}
                        selectedRows={selectedOrganizationIds}
                        onSelected={handleSelected}
                    />
                </>}
            </Paper>
        </RadioGroup>
    </FullScreenDialog>);
}
