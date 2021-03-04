import AgeRangeForm from "./Form";
import { AgeRange } from "@/types/graphQL";
import {
    buildAgeRangeLabel,
    buildEmptyAgeRange,
} from "@/utils/ageRanges";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    DialogContentText,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    value?: AgeRange;
    open: boolean;
    onClose: (updatedAgeRange?: AgeRange) => void;
}

export default function (props: Props) {
    const {
        open,
        onClose,
        value,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { required, equals } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ updatedAgeRange, setUpdatedAgeRange ] = useState(value ?? buildEmptyAgeRange());
    const [ valid, setValid ] = useState(true);

    useEffect(() => {
        setUpdatedAgeRange(value ?? buildEmptyAgeRange());
    }, [ open ]);

    const handleSave = async () => {
        try {
            onClose(updatedAgeRange);
            enqueueSnackbar(`Age range successfully saved`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        const ageRangeName = value ? buildAgeRangeLabel(value) : ``;
        try {
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
            onClose(updatedAgeRange);
            enqueueSnackbar(`Age range successfully deleted`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Dialog
                title="Edit Age Range"
                open={open}
                actions={[
                    {
                        label: `Delete`,
                        color: `error`,
                        align: `left`,
                        onClick: handleDelete,
                    },
                    {
                        label: `Cancel`,
                        color: `primary`,
                        align: `right`,
                        onClick: () => onClose(),
                    },
                    {
                        label: `Save`,
                        color: `primary`,
                        align: `right`,
                        onClick: handleSave,
                        disabled: !valid,
                    },
                ]}
                onClose={() => onClose()}
            >
                <AgeRangeForm
                    value={updatedAgeRange}
                    onChange={setUpdatedAgeRange}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
