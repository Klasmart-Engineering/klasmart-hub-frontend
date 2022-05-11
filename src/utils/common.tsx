import { useValidations } from "@/utils/validations";
import { usePrompt } from "@kl-engineering/kidsloop-px";
import { DialogContentText } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteEntity {
    title: string;
    entityName: string;
}

interface MarkInactiveEntity extends DeleteEntity { }

export const useDeleteEntityPrompt = () => {
    const intl = useIntl();
    const { required, equals } = useValidations();
    const prompt = usePrompt();
    return (props: DeleteEntity) => {
        const { entityName, title } = props;
        return prompt({
            variant: `error`,
            title,
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }, {
                userName: entityName,
            }),
            content: (
                <>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `editDialog_deleteConfirm`,
                        }, {
                            userName: entityName,
                        })}
                    </DialogContentText>
                    <DialogContentText>{intl.formatMessage({
                        id: `generic_typeToRemovePrompt`,
                    }, {
                        value: <strong>{entityName}</strong>,
                    })}
                    </DialogContentText>
                </>
            ),
            validations: [ required(), equals(entityName) ],
        });
    };
};

export const useMarkInactiveEntityPrompt = () => {
    const intl = useIntl();
    const { required, equals } = useValidations();
    const prompt = usePrompt();
    return (props: MarkInactiveEntity) => {
        const {
            entityName,
            title,
        } = props;
        return prompt({
            variant: `error`,
            title,
            okLabel: intl.formatMessage({
                id: `common.action.inactive`,
            }),
            content: (
                <>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `user.inactivate.confirm`,
                        }, {
                            userName: entityName,
                        })}
                    </DialogContentText>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `user.inactivate.details`,
                        })}
                    </DialogContentText>
                    <DialogContentText>{intl.formatMessage({
                        id: `user.inactivate.typeToMarkInactivePrompt`,
                    }, {
                        value: <strong>{entityName}</strong>,
                    })}
                    </DialogContentText>
                </>
            ),
            validations: [ required(), equals(entityName) ],
        });
    };
};
interface BlukEditProp {
    action: '' | 'Active' | 'InActive';
    entityName: string;
    isMismatch: boolean;
}

export const useBulkUserAction = () => {
    const intl = useIntl();
    const { required, equals } = useValidations();
    const prompt = usePrompt();
    return (props: BlukEditProp) => {
        const {
            action,
            entityName,
            isMismatch,
        } = props;

        return prompt({
            variant: `error`,
            title: action === `Active` ? intl.formatMessage({
                id: `entity.user.template.editprompt.activate`,
                defaultMessage: `Mark user Active`,
            }) : intl.formatMessage({
                id: `entity.user.template.editprompt.inactive`,
                defaultMessage: `Mark user InActive`,
            }),
            content: (
                <>
                    <DialogContentText>
                        {action === `Active` ? intl.formatMessage({
                            id: `user.activate.status.confirm`,
                            defaultMessage: `Are you sure you want to mark users active?`,
                        }) : intl.formatMessage({
                            id: `user.inactivate.status.confirm`,
                            defaultMessage: `Are you sure you want to mark users inactive?`,
                        })}
                    </DialogContentText>
                    {action === `InActive` &&
                        <DialogContentText>
                            {intl.formatMessage({
                                id: `user.inactivate.details`,
                            })}
                        </DialogContentText>}
                    {isMismatch ? <p>There is a mix of active and inactive users on your selection.</p> : ` `}

                    <DialogContentText>{intl.formatMessage({
                        id: `user.inactivate.typeToMarkInactivePrompt`,
                    }, {
                        value: <strong>{entityName}</strong>,
                    })}
                    </DialogContentText>
                </>
            ),
            validations: [ required(), equals(entityName) ],
        });
    };
};
