import { ContentItemDetails } from "@/types/objectTypes";
import {
    createStyles,
    makeStyles,
    TextField,
    Theme,
} from "@material-ui/core";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const getFolderNameHelperText = (name: string | undefined) => {
    if (!name?.length) return `Required`;
};

interface Props {
    value: ContentItemDetails;
    onChange: (value: ContentItemDetails) => void;
    onValidation: (valid: boolean) => void;
}

export default function SchoolDialogForm(props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const [ folderName, setFolderName ] = useState(value.name ?? ``);

    useEffect(() => {
        onValidation(!getFolderNameHelperText(folderName));
    }, [ folderName ]);

    useEffect(() => {
        const updatedFolder: ContentItemDetails = {
            id: value.id,
            name: folderName.trim(),
        };
        onChange(updatedFolder);
    }, [ folderName ]);

    return (
        <>
            <TextField
                fullWidth
                helperText={getFolderNameHelperText(folderName) ?? ` `}
                error={!!getFolderNameHelperText(folderName)}
                value={folderName}
                label="Folder name"
                variant="outlined"
                type="text"
                autoFocus={!value?.id}
                onChange={(e) => setFolderName(e.currentTarget.value)}
            />
        </>
    );
}
