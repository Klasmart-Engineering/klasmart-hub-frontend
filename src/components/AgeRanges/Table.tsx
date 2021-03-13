import {
    useDeleteAgeRange,
    useGetAllAgeRanges,
} from "@/api/age_ranges";
import { currentMembershipVar } from "@/cache";
import CreateAgeRangeDialog from "@/components/AgeRanges/Dialog/Create";
import EditAgeRangeDialog from "@/components/AgeRanges/Dialog/Edit";
import { AgeRange } from "@/types/graphQL";
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
        const rows = data?.organization?.ageRanges?.filter((range: AgeRange) => range.status === `active`)
            .map((range: AgeRange): AgeRangeRow => ({
                ...range,
                ageRange: buildAgeRangeLabel(range),
            })) ?? [];

        setRows(rows);
    }, [ data ]);

    const columns: TableColumn<AgeRangeRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `ageRange`,
            label: `Age Range`,
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
            title: `Delete Age Range`,
            okLabel: `Delete`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${ageRangeName}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{ageRangeName}</strong> to confirm deletion.</DialogContentText>
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
            enqueueSnackbar(`Age range successfully deleted`, {
                variant: `success`,
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
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
                        label: `Create Age Range`,
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    }}
                    rowActions={(row) => [
                        {
                            label: `Edit`,
                            icon: EditIcon,
                            disabled: !canEdit || !!row.system,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            disabled: !canDelete || !!row.system,
                            onClick: handleDeleteRowClick,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `Age Ranges`,
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
                    console.log(`ageRange`, ageRange);
                    setSelectedAgeRange(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
