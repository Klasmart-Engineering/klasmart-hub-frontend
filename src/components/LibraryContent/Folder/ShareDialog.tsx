import { useGetAllOrganizations } from "@/api/organizations";
import { useRestAPI } from "@/api/restapi";
import { currentMembershipVar } from "@/cache";
import { ContentItemDetails } from "@/types/objectTypes";
import { useReactiveVar } from "@apollo/client";
import {
    Avatar,
    Box,
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    FullScreenDialog,
    Table,
    useSnackbar,
    utils,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Head";
import { isEqual } from "lodash";
import React, {
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({
    paperRoot: {
        width: `100%`,
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        color: `white`,
        marginRight: 16,
        fontSize: 10,
    },
}));

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
    const restApi = useRestAPI();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ selectedOrganizationIds, setSelectedOrganizationIds ] = useState<string[]>([]);
    const [ initSelectedOrganizationIds, setInitSelectedOrganizationIds ] = useState<string[]>();
    const { data: dataOrganizations, loading: loadingGetOrganizations } = useGetAllOrganizations();
    const [ loadingGetFolderShareStatus, setLoadingGetFolderShareStatus ] = useState(false);
    const [ rows, setRows ] = useState<OrganizationRow[]>([]);

    const getFolderShareStatus = async () => {
        setLoadingGetFolderShareStatus(true);
        try {
            const folderShareStatus = await restApi.getFoldersShare({
                folder_ids: value?.id ?? ``,
                metaLoading: true,
                org_id: organization_id,
            });
            const organizationsIds = folderShareStatus.data?.flatMap((d) => d.orgs.map((org) => org.id)) ?? [];
            organizationsIds.sort((a, b) => a.localeCompare(b));
            setSelectedOrganizationIds(organizationsIds);
            if (!initSelectedOrganizationIds) setInitSelectedOrganizationIds(organizationsIds);
        } catch (err) {
            console.error(err);
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
        setLoadingGetFolderShareStatus(false);
    };

    const putFolderShareStatus = async () => {
        try {
            setSelectedOrganizationIds([]);
            await restApi.putFoldersShare({
                folder_ids: [ value?.id ?? `` ],
                org_id: organization_id,
                org_ids: selectedOrganizationIds,
            });
            enqueueSnackbar(`Share settings successfully updated`, {
                variant: `success`,
            });
            onClose();
        } catch (err) {
            console.error(err);
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const handleSelected = (selectedIds: string[]) => {
        selectedIds.sort((a, b) => a.localeCompare(b));
        setSelectedOrganizationIds(selectedIds);
    };

    useEffect(() => {
        if (!open || !value || !organization_id) return;
        getFolderShareStatus();
    }, [
        open,
        value,
        organization_id,
    ]);

    useEffect(() => {
        const rows: OrganizationRow[] = dataOrganizations?.organizations
            ?.filter((organization) => organization.status === `active` && organization?.organization_id !== organization_id)
            .map((organization) => ({
                id: organization?.organization_id ?? ``,
                name: organization?.organization_name ?? ``,
                phone: organization?.phone ?? ``,
            })) ?? [];
        setRows(rows);
    }, [ dataOrganizations, organization_id ]);

    useEffect(() => {
        setSelectedOrganizationIds([]);
        setInitSelectedOrganizationIds(undefined);
    }, [ open ]);

    const columns: TableColumn<OrganizationRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: `Name`,
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
                        }}>
                        {utils.nameToInitials(row.name, 4)}
                    </Avatar>
                    <span>{row.name}</span>
                </Box>
            ),
        },
        {
            id: `phone`,
            label: `Phone`,
        },
    ];

    return <FullScreenDialog
        open={open}
        title={`Share "${value?.name ?? ``}"`}
        action={{
            label: `Share`,
            disabled: !initSelectedOrganizationIds || isEqual(selectedOrganizationIds, initSelectedOrganizationIds),
            onClick: putFolderShareStatus,
        }}
        onClose={onClose}
    >
        <Paper className={classes.paperRoot}>
            <Table
                showCheckboxes
                idField="id"
                orderBy="name"
                loading={loadingGetFolderShareStatus || loadingGetOrganizations}
                rows={rows}
                columns={columns}
                selectedRows={selectedOrganizationIds}
                onSelected={handleSelected}
            />
        </Paper>
    </FullScreenDialog>;
}
