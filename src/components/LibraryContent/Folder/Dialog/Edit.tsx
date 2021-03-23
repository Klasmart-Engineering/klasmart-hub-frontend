import LibraryFolderDialogForm from "./Form";
import { useRestAPI } from "@/api/restapi";
import { currentMembershipVar } from "@/cache";
import { ContentItemDetails } from "@/types/objectTypes";
import { newLibraryContent } from "@/utils/libraryContents";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    value?: ContentItemDetails;
    onClose: (value?: ContentItemDetails) => void;
}

export default function EditFolderDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const restApi = useRestAPI();
    const [ editedLibraryContent, setEditedLibraryContent ] = useState(newLibraryContent());
    const [ valid, setValid ] = useState(true);
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;

    useEffect(() => {
        setEditedLibraryContent(value ?? newLibraryContent());
    }, [ value ]);

    const handleSave = async () => {
        if (!value) return;
        const { name } = editedLibraryContent;
        const { id } = value;
        try {
            await restApi.updateFolderItemsDetailsById({
                folder_id: id,
                name,
                org_id: organization_id,
            });
            onClose(editedLibraryContent);
            enqueueSnackbar(intl.formatMessage({
                id: `library_editSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        if (!value) return;
        const input = await prompt({
            title: intl.formatMessage({
                id: `library_deleteContentedLabel`,
            }),
            content: <>
                <p>
                    {intl.formatMessage({
                        id: `editDialog_deleteConfirm`,
                    }, {
                        userName: value?.name,
                    })}
                </p>
                <p>{intl.formatMessage({
                    id: `generic_typeText`,
                })}<strong>{value.name}</strong> {intl.formatMessage({
                    id: `generic_typeEndText`,
                })}</p>
            </>,
            variant: `error`,
        });
        if (input !== value.name) return;
        const { id } = value;
        try {
            await restApi.deleteFoldersItemsById({
                org_id: organization_id,
                folder_id: id,
            });
            onClose(editedLibraryContent);
            enqueueSnackbar(intl.formatMessage({
                id: `library_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `library_editTitle`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `library_deleteLabel`,
                    }),
                    color: `error`,
                    align: `left`,
                    onClick: handleDelete,
                },
                {
                    label: intl.formatMessage({
                        id: `library_cancelLabel`,
                    }),
                    color: `primary`,
                    align: `right`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `generic_saveLabel`,
                    }),
                    color: `primary`,
                    align: `right`,
                    disabled: !valid,
                    onClick: handleSave,
                },
            ]}
            onClose={() => onClose()}
        >
            <LibraryFolderDialogForm
                value={editedLibraryContent}
                onChange={(value) => setEditedLibraryContent(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
