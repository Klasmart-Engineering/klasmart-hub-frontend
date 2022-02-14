import { ContentItemDetails } from "@/types/objectTypes";
import {
    TextField,
    Theme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{
    useEffect,
    useState,
} from "react";
import {
    IntlShape,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const getFolderNameHelperText = (name: string | undefined, intl: IntlShape) => {
    if (!name?.length) return intl.formatMessage({
        id: `genericValidations_required`,
    });
};

interface Props {
    value: ContentItemDetails;
    onChange: (value: ContentItemDetails) => void;
    onValidation: (valid: boolean) => void;
}

export default function SchoolDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ folderName, setFolderName ] = useState(value.name ?? ``);

    useEffect(() => {
        onValidation(!getFolderNameHelperText(folderName, intl));
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
                helperText={getFolderNameHelperText(folderName, intl) ?? ` `}
                error={!!getFolderNameHelperText(folderName, intl)}
                value={folderName}
                label={intl.formatMessage({
                    id: `library_folderNameLabel`,
                })}
                variant="outlined"
                type="text"
                autoFocus={!value?.id}
                onChange={(e) => setFolderName(e.currentTarget.value)}
            />
        </>
    );
}
