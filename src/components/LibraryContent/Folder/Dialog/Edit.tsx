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
            enqueueSnackbar(`Folder has been saved succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        if (!value) return;
        const input = await prompt({
            title: `Delete Content`,
            content: <>
                <p>Are you sure you want to delete {`"${value.name}"`}?</p>
                <p>Type <strong>{value.name}</strong> to confirm deletion.</p>
            </>,
            variant: `error`,
        });
        if (input !== value.name) return;
        const { id } = value;
        try {
            await restApi.deleteFoldersItemsById({
                org_id: organization_id,
                content_id: id,
            });
            onClose(editedLibraryContent);
            enqueueSnackbar(`Folder has been deleted succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title="Edit folder"
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
