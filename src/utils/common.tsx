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
