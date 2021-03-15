import {
    useDeleteAgeRange,
    useGetAllAgeRanges,
} from "@/api/age_ranges";
import { currentMembershipVar } from "@/cache";
import CreateAgeRangeDialog from "@/components/AgeRanges/Dialog/Create";
import EditAgeRangeDialog from "@/components/AgeRanges/Dialog/Edit";
import {
    AgeRange,
    Status,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@material-ui/icons";
import {
    PageTable,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
}));

export interface AgeRangeRow extends AgeRange{
    ageRange: string;
}

interface Props {
}

export default function (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { required, equals } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows, setRows ] = useState<AgeRangeRow[]>([]);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedAgeRange, setSelectedAgeRange ] = useState<AgeRange>();
    const canCreate = usePermission(`create_age_range_20222`);
    const canEdit = usePermission(`edit_age_range_20332`);
    const canDelete = usePermission(`delete_age_range_20442`);
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ deleteAgeRange ] = useDeleteAgeRange();
    const { data, refetch } = useGetAllAgeRanges({
        variables: {
            organization_id,
        },
    });

    useEffect(() => {
        const rows = data?.organization?.ageRanges?.filter((range: AgeRange) => range.status === Status.ACTIVE)
            .map((range: AgeRange): AgeRangeRow => ({
                ...range,
                ageRange: buildAgeRangeLabel(range),
            })) ?? [];

        setRows(rows);
    }, [ data ]);

    const columns: TableColumn<AgeRangeRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `ageRanges_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `ageRange`,
            label: intl.formatMessage({
                id: `ageRanges_ageRangeLabel`,
            }),
            persistent: true,
        },
    ];

    const findAgeRange = (row: AgeRangeRow) => data?.organization?.ageRanges?.find((ageRange: AgeRange) => ageRange.id === row.id);

    const handleEditRowClick = async (row: AgeRangeRow) => {
        const selectedAgeRange = findAgeRange(row);
        if (!selectedAgeRange) return;
        setSelectedAgeRange({
            age_range_id: selectedAgeRange.id,
            from: selectedAgeRange.low_value,
            fromUnit: selectedAgeRange.low_value_unit,
            to: selectedAgeRange.high_value,
            toUnit: selectedAgeRange.high_value_unit,
        } as unknown as AgeRange);
        setSelectedAgeRange(selectedAgeRange);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: AgeRangeRow) => {
        const selectedAgeRange = findAgeRange(row);
        if (!selectedAgeRange) return;
        setSelectedAgeRange(selectedAgeRange);
        const ageRangeName = buildAgeRangeLabel(row);

        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `ageRanges_deleteAgeRangeTitle`,
            }),
            okLabel: `Delete`,
            content: <>
                <DialogContentText>{intl.formatMessage({
                    id: `class_confirmDelete`,
                }, {
                    ageRangeName,
                })}</DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `ageRanges_typeText`,
                }, {
                    ageRangeName,
                })} <strong>{ageRangeName}</strong> {intl.formatMessage({
                    id: `ageRanges_typeEndText`,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(ageRangeName) ],
        })) return;
        try {

            await deleteAgeRange({
                variables: {
                    id: selectedAgeRange.id,
                },
            });

            refetch();
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Paper className={classes.root}>
                <PageTable
                    idField="id"
                    rows={rows}
                    columns={columns}
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `ageRanges_createAgeRangeLabel`,
                        }),
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `ageRanges_editLabel`,
                            }),
                            icon: EditIcon,
                            disabled: !canEdit || !!row.system,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `ageRanges_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: !canDelete || !!row.system,
                            onClick: handleDeleteRowClick,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `ageRanges_title`,
                            }),
                        },
                    })}
                />
            </Paper>
            <CreateAgeRangeDialog
                open={openCreateDialog}
                refetch={refetch}
                onClose={() => {
                    setOpenCreateDialog(false);
                }}
            />
            <EditAgeRangeDialog
                open={openEditDialog}
                value={selectedAgeRange}
                refetch={refetch}
                onClose={(ageRange) => {
                    setSelectedAgeRange(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
