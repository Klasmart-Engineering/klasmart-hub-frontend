import LibraryFolderDialogForm from "./Form";
import { useRestAPI } from "@/api/restapi";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { ContentItemDetails } from "@/types/objectTypes";
import { newLibraryContent } from "@/utils/libraryContents";
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
import { useIntl } from "react-intl";

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
    const intl = useIntl();
    const restApi = useRestAPI();
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const [ newFolder, setNewFolder ] = useState(newLibraryContent());
    const currentOrganization = useCurrentOrganization();

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
                org_id: currentOrganization?.organization_id ?? ``,
            });
            onClose(newFolder);
            enqueueSnackbar(intl.formatMessage({
                id: `library_createFolderSuccess`,
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
                id: `library_createFolderTitle`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `library_cancelLabel`,
                    }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `library_createLabel`,
                    }),
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
