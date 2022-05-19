import {
    Dialog,
    Select
} from "@kl-engineering/kidsloop-px";
import { useValidations } from "@/utils/validations";
import React, {
    useEffect,
    useState
} from "react";
import {
    FormattedMessage,
    useIntl
} from "react-intl";
import {
    useDeactivateAllUsersInOrganization,
    useReactivateAllUsersInOrganization
} from "@/api/organizationMemberships";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { UserRow } from "../Table";
import {
    Theme,
    Typography
} from "@mui/material";
import {
    createStyles,
    makeStyles
} from "@mui/styles";
interface Props {
    open: boolean;
    selectedUsers: UserRow[];
    isMismatch: boolean;
    onClose: (didEdit?: boolean) => void;
    handleReset: () => void;
}
const useStyles = makeStyles((theme: Theme) => createStyles({
    warning: {
        color: theme.palette.error.main,
    },
}));
export default function EditBulkUserDialog(props: Props) {
    const {
        open,
        onClose,
        selectedUsers,
        isMismatch,
        handleReset,
    } = props;
    const intl = useIntl();
    const classes = useStyles();
    const [actionStatus, setActionStatus] = useState<`` | `Active` | `Inactive`>(``);
    const [reactivateUser] = useReactivateAllUsersInOrganization();
    const [deactivateUser] = useDeactivateAllUsersInOrganization();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const { enqueueSnackbar } = useSnackbar();
    const { required } = useValidations();
    const confirmAction = async (actionStatus: `` | `Active` | `Inactive`, selectedUser: UserRow[]) => {
        setActionStatus('');
        if (actionStatus === ``) return;
        onClose();
        const [user, ...rest] = selectedUser;
        const userIds = selectedUser.map(user => user.id);
        if (user.status.toUpperCase() === actionStatus.toUpperCase()) {
            handleReset();
            return;
        }
        try {
            if (actionStatus === 'Active') {
                await reactivateUser({
                    variables: {
                        organizationId,
                        userIds,
                    },
                });
            } else if (actionStatus === 'Inactive') {
                await deactivateUser({
                    variables: {
                        organizationId,
                        userIds,
                    }
                });
            }
            actionStatus === `Active` ? enqueueSnackbar(intl.formatMessage({
                id: `user.activate.success`,
            }), {
                variant: `success`,
            }) :
                enqueueSnackbar(intl.formatMessage({
                    id: `user.inactivate.success`,
                }), {
                    variant: `success`,
                });
            handleReset();
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };
    return (
        <Dialog
            title={intl.formatMessage({
                id: `entity.user.template.editpopup.title`,
            })}
            open={open}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `entity.user.template.editpopup.cancel`,
                    }),
                    color: `primary`,
                    onClick: onClose,
                },
                {
                    label: intl.formatMessage({
                        id: `entity.user.template.editpopup.proceed`,
                    }),
                    color: `primary`,
                    disabled: isMismatch,
                    onClick: () => confirmAction(actionStatus, selectedUsers),
                }
            ]}
            onClose={onClose}
        >
            <Select
                fullWidth
                label={intl.formatMessage({
                    id: `entity.user.template.editpopup.select`,
                })}

                items={[`Active`, `Inactive`]}
                value={actionStatus}
                validations={[
                    required(intl.formatMessage({
                        id: `entity.user.template.editpopup.select.required`,
                    })),
                ]}
                onChange={(value) => setActionStatus(value)}
            />
            {isMismatch &&
                <Typography className={classes.warning}>
                    <FormattedMessage id="entity.user.status.mix.error" />
                </Typography>}
        </Dialog>
    );
}
