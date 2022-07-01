import { useQueryMyUser } from "@/api/myUser";
import { useValidations } from "@/utils/validations";
import { usePrompt } from "@kl-engineering/kidsloop-px";
import { DialogContentText, Link } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteEntity {
    title: string;
    entityName: string;
    isUser?: boolean
}

interface MarkInactiveEntity extends DeleteEntity { }

export const useDeleteEntityPrompt = () => {
    const intl = useIntl();
    const { required, equals } = useValidations();
    const prompt = usePrompt();
    const { data: meData } = useQueryMyUser();
    const adminName = meData && `${meData.myUser.node.givenName} ${meData.myUser.node.familyName}`;
    return (props: DeleteEntity) => {
        const { entityName, title, isUser } = props;
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
                    {isUser &&
                        <DialogContentText>
                            {
                                intl.formatMessage({
                                    id: `user.delete.warning`,
                                }, {
                                    entityName,
                                    link:
                                        <Link
                                            href="#/user-deletion-warning"
                                            target="_blank"
                                        >
                                            {intl.formatMessage({
                                                id: `user.generatedData.link`,
                                            })}
                                        </Link>,
                                    adminName,
                                })}
                        </DialogContentText>
                    }
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
