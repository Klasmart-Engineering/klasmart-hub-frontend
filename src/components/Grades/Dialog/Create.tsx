import GradeForm from "./Form";
import { Grade } from "@/types/graphQL";
import { buildEmptyGrade } from "@/utils/grades";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    onClose: (newGrade?: Grade) => void;
}

export default function (props: Props) {
    const { open, onClose } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ newGrade, setNewGrade ] = useState(buildEmptyGrade());
    const [ valid, setValid ] = useState(true);

    useEffect(() => {
        setNewGrade(buildEmptyGrade());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            onClose(newGrade);
            enqueueSnackbar(`Grade successfully created`, {
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
                title="Create Grade"
                open={open}
                actions={[
                    {
                        label: `Cancel`,
                        color: `primary`,
                        onClick: () => onClose(),
                    },
                    {
                        label: `Create`,
                        color: `primary`,
                        onClick: handleCreate,
                        disabled: !valid,
                    },
                ]}
                onClose={() => onClose()}
            >
                <GradeForm
                    value={newGrade}
                    onChange={setNewGrade}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
