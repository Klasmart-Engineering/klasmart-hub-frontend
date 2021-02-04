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
    parentId?: string;
    onClose: (value?: ContentItemDetails) => void;
}

export default function CreateFolderDialog (props: Props) {
    const {
        open,
        parentId,
        onClose,
    } = props;
    const classes = useStyles();
    const restApi = useRestAPI();
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const [ newFolder, setNewFolder ] = useState(newLibraryContent());
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;

    useEffect(() => {
        if (!open) return;
        setNewFolder(newLibraryContent());
    }, [ open ]);

    const handleCreate = async () => {
        const {
            name,
            partition,
        } = newFolder;
        try {
            await restApi.createFoldersItems({
                name,
                parent_id: parentId,
                partition,
                org_id: organization_id,
            });
            onClose(newFolder);
            enqueueSnackbar(`Folder has been created succesfully`, {
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
            title="Create folder"
            actions={[
                {
                    label: `Cancel`,
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: `Create`,
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
            onClose={() => onClose()}
        >
            <LibraryFolderDialogForm
                value={newFolder}
                onValidation={setValid}
                onChange={(value) => setNewFolder(value)}
            />
        </Dialog>
    );
}
