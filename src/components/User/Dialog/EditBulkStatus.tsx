import { User } from "@/types/graphQL";
import { Dialog, Select } from "@kl-engineering/kidsloop-px";
import { useValidations } from "@/utils/validations";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useBulkUserAction } from "@/utils/common";
import { useDeactivateAllUsersInOrganization, useReactivateAllUsersInOrganization } from "@/api/organizationMemberships";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {

    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { UserRow } from "../Table";
interface Props {
    open: boolean;
    selectedUsers: UserRow[]
    onClose: (didEdit?: boolean) => void;
}
export default function EditBulkUserDialog(props: Props) {
    const {
        open,
        onClose,
        selectedUsers
    } = props;
    const { required } = useValidations();
    const intl = useIntl();
    const useBulkUserPrompt = useBulkUserAction();
    const [actionStatus, setActionStatus] = useState<`` | `Active` | `InActive`>(``);
    const [reactivateUser] = useReactivateAllUsersInOrganization();
    const [deactivateUser] = useDeactivateAllUsersInOrganization();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const { enqueueSnackbar } = useSnackbar();
    const confirmAction = async (actionStatus: `` | `Active` | `InActive`, selectedUser: UserRow[]) => {
        console.log("selectedUser", selectedUser);
        if (actionStatus === ``) return;
        onClose();
        const filterUser = selectedUser.filter(({ status }) => status === (actionStatus === 'Active' ? 'inactive' : 'active'));
        const userIds = filterUser.map((user) => {
            return user.id
        });
        const isMismatch = !!selectedUser.find(({ status }) => status === (actionStatus === 'Active' ? 'active' : 'inactive'));
        console.log("isMismatch", isMismatch);
        if (!await useBulkUserPrompt({
            entityName: actionStatus,
            action: actionStatus,
            isMismatch
        })) return;
        try {
            if (actionStatus === 'Active') {
                await reactivateUser({
                    variables: {
                        organizationId,
                        userIds,
                    },
                });
            } else if (actionStatus === 'InActive') {
                await deactivateUser({
                    variables: {
                        organizationId,
                        userIds,
                    }
                });
            }
            actionStatus === `Active` ? enqueueSnackbar(intl.formatMessage({
                id: `user.activate.success`,
                defaultMessage: `User has been reactivated successfully`
            }), {
                variant: `success`,
            }) : enqueueSnackbar(intl.formatMessage({
                id: `user.inactivate.success`,
                defaultMessage: `User has been marked inactive`
            }), {
                variant: `success`,
            });
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
                defaultMessage: `Edit Users`,
            })}
            open={open}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `entity.user.template.editpopup.cancel`,
                        defaultMessage: `Cancel`,
                    }),
                    color: `primary`,
                    onClick: onClose,
                },
                {
                    label: intl.formatMessage({
                        id: `entity.user.template.editpopup.proceed`,
                        defaultMessage: `Proceed`,
                    }),
                    color: `primary`,
                    onClick: () => confirmAction(actionStatus, selectedUsers),
                },
            ]}
            onClose={onClose}
        >
            <Select
                fullWidth
                label={intl.formatMessage({
                    id: `entity.user.template.editpopup.select`,
                    defaultMessage: `Status`
                })}

                items={[`Active`, `InActive`]}
                value={actionStatus}
                validations={[
                    required(intl.formatMessage({
                        id: `entity.user.template.editpopup.select.required`,
                        defaultMessage: `required`
                    })),
                ]}
                onChange={(value) => setActionStatus(value)}
            />
        </Dialog>
    );
}
function enqueueSnackbar(arg0: string, arg1: { variant: string; }) {
    throw new Error("Function not implemented.");
}

