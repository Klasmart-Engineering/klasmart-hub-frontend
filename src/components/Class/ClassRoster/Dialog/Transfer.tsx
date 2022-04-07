import { ClassRosterSubgroup } from "../Table";
import TransferForm,
{
    defaultState,
    Errors,
    State,
} from "./TransferForm";
import {
    MoveUsersToClassRequest,
    useMoveStudentsToClass,
    useMoveTeachersToClass,
} from "@/api/classRoster";
import {
    Button,
    Dialog,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    userIds: string[];
    currentClassId: string;
    subgroupBy: ClassRosterSubgroup;
    goToClassRoster: (classId: string) => void;
    onSuccess: () => void;
    onClose: () => void;
}

const useStyles = makeStyles((theme) => {
    return createStyles({
        snackbarLink: {
            textDecoration: `underline`,
        },
    });
});

export default function TransferClassDialog (props: Props) {
    const {
        open,
        onSuccess,
        onClose,
        goToClassRoster,
        userIds,
        subgroupBy,
        currentClassId,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const [ moveStudentsToClass ] = useMoveStudentsToClass();
    const [ moveTeachersToClass ] = useMoveTeachersToClass();
    const [ initialFormState, setInitialFormState ] = useState<State>(defaultState);
    const [ formState, setFormState ] = useState<State>(defaultState);
    const [ formErrors, setFormErrors ] = useState<Errors>({});

    const moveUsersToClass = (variables: MoveUsersToClassRequest, subgroupBy: string) => {
        if(subgroupBy === `Student`) {
            return moveStudentsToClass({
                variables,
            });
        } else if (subgroupBy === `Teacher`) {
            return moveTeachersToClass({
                variables,
            });
        }

        throw new Error(`subgroup not compatible to move user to a new class`);
    };

    const handleCreate = async () => {
        try {
            const variables = {
                userIds: userIds ?? [],
                fromClassId: currentClassId ?? ``,
                toClassId: formState.targetClassId ?? ``,
            };

            const response = await moveUsersToClass(variables, subgroupBy);
            onSuccess();
            onClose();
            enqueueSnackbar(intl.formatMessage({
                id: `classRoster_classTransferedMessageSuccess`,
                defaultMessage: `Users have been successfully transfered`,
            }), {
                action: (
                    <>
                        <Button
                            color="white"
                            className={classes.snackbarLink}
                            variant="text"
                            label={intl.formatMessage({
                                id: `classRoster_goToClass`,
                                defaultMessage: `Go to class`,
                            })}
                            onClick={() => { goToClassRoster(formState.targetClassId); }}
                        />
                    </>
                ),
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `classRoster_classTransferedMessageError`,
                defaultMessage: `There was a problem transfering your users`,
            }), {
                variant: `error`,
            });
        }
    };

    const onChange = (newFormState: State) => {
        setFormState(newFormState);
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `classRoster_transferClassTitle`,
                defaultMessage: `Transfer Class`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `class_cancelLabel`,
                    }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `class_transferLabel`,
                        defaultMessage: `Transfer`,
                    }),
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
            onClose={() => onClose()}
        >

            <TransferForm
                userIds={userIds}
                currentClassId={currentClassId}
                subgroupBy={subgroupBy}
                initialState={initialFormState}
                errors={formErrors}
                onChange={onChange}
                onValidation={setValid}
            />
        </Dialog>
    );
}
