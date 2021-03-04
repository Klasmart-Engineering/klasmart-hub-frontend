import GradeForm from "./Form";
import { Grade } from "@/types/graphQL";
import { buildEmptyGrade } from "@/utils/grades";
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
    value?: Grade;
    open: boolean;
    onClose: (updatedGrade?: Grade) => void;
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
    const { equals, required } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ updatedGrade, setUpdatedGrade ] = useState(value ?? buildEmptyGrade());
    const [ valid, setValid ] = useState(true);

    useEffect(() => {
        setUpdatedGrade(value ?? buildEmptyGrade());
    }, [ open ]);

    const handleSave = async () => {
        try {
            onClose(updatedGrade);
            enqueueSnackbar(`Grade successfully saved`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        try {
            if (!await prompt({
                variant: `error`,
                title: `Delete Grade`,
                okLabel: `Delete`,
                content: <>
                    <DialogContentText>Are you sure you want to delete {`"${value?.grade_name}"`}?</DialogContentText>
                    <DialogContentText>Type <strong>{value?.grade_name}</strong> to confirm deletion.</DialogContentText>
                </>,
                validations: [ required(), equals(value?.grade_name) ],
            })) return;
            onClose(updatedGrade);
            enqueueSnackbar(`Grade successfully deleted`, {
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
                title="Edit Grade"
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
                <GradeForm
                    value={updatedGrade}
                    onChange={setUpdatedGrade}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
