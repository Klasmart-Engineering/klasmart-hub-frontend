import { useValidations } from "@/utils/validations";
import { DialogContentText } from "@mui/material";
import { usePrompt } from "kidsloop-px";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteEntity {
    title: string;
    entityName: string;
}

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
                    })}</DialogContentText>
                </>
            ),
            validations: [ required(), equals(entityName) ],
        });
    };
};
