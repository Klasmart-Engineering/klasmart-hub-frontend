import CreateAgeRangeDialog from "@/components/AgeRanges/Dialog/Create";
import EditAgeRangeDialog from "@/components/AgeRanges/Dialog/Edit";
import { AgeRange } from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
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

interface AgeRangeRow {
    id: string;
    ageRange: string;
    from: number;
    fromUnit: string;
    to: number;
    toUnit: string;
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
    const dataAgeRanges: AgeRange[] = [
        {
            age_range_id: `1`,
            from: 12,
            fromUnit: `month`,
            to: 2,
            toUnit: `year`,
        },
    ];

    useEffect(() => {
        const rows = dataAgeRanges?.map((ageRange) => ({
            id: ageRange.age_range_id,
            ageRange: buildAgeRangeLabel(ageRange),
            from: ageRange.from ?? 0,
            fromUnit: ageRange.fromUnit ?? ``,
            to: ageRange.to ?? 0,
            toUnit: ageRange.fromUnit ?? ``,
        })) ?? [];
        setRows(rows);
    }, []);
    // }, [ dataAgeRanges ]);

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

    const findAgeRange = (row: AgeRangeRow) => dataAgeRanges.find((ageRange) => ageRange.age_range_id === row.id);

    const handleEditRowClick = async (row: AgeRangeRow) => {
        const selectedAgeRange = findAgeRange(row);
        if (!selectedAgeRange) return;
        setSelectedAgeRange(selectedAgeRange);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: AgeRangeRow) => {
        const selectedAgeRange = findAgeRange(row);
        if (!selectedAgeRange) return;
        setSelectedAgeRange(selectedAgeRange);
        const ageRangeName = buildAgeRangeLabel(selectedAgeRange);
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
            enqueueSnackbar(`Age range successfully deleted`, {
                variant: `success`,
            });
        } catch (err) {
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
                            disabled: !canEdit,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            disabled: !canDelete,
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
                onClose={(ageRange) => {
                    setOpenCreateDialog(false);
                }}
            />
            <EditAgeRangeDialog
                open={openEditDialog}
                value={selectedAgeRange}
                onClose={(ageRange) => {
                    console.log(`ageRange`, ageRange);
                    setSelectedAgeRange(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
