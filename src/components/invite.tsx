import StyledTextField from "../components/styled/textfield";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ContentCopy as CopyIcon } from "@styled-icons/material/ContentCopy";
import React,
{
    useEffect,
    useRef,
} from "react";
import { useIntl } from "react-intl";

export default function InviteButton ({ url }: { url: string }): JSX.Element {
    const { enqueueSnackbar } = useSnackbar();
    const intl = useIntl();
    const textField = useRef<HTMLInputElement>(null);

    const selectShareLinkText = async (e: MouseEvent) => {
        const inputEl = e.target as HTMLInputElement;
        inputEl.select();
    };

    useEffect(() => {
        if (!textField.current) { return; }
        textField.current.addEventListener(`click`, selectShareLinkText);
        return textField.current.removeEventListener(`click`, selectShareLinkText);
    }, [ textField.current ]);

    return <>
        <Grid
            container
            item
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            xs={12}
            style={{
                paddingTop: 8,
                flexGrow: 0,
            }}
        >
            <StyledTextField
                fullWidth
                margin="dense"
                inputRef={textField}
                value={url}
                inputProps={{
                    style: {
                        verticalAlign: `center`,
                        fontFamily: `monospace`,
                    },
                }}
                InputProps={{
                    endAdornment:
                        <Tooltip
                            placement="bottom"
                            title="Copy to clipboard">
                            <IconButton
                                aria-label="copy"
                                size="large"
                                onClick={() => {
                                    if (!textField.current) { return; }
                                    textField.current.select();
                                    document.execCommand(`copy`);
                                    enqueueSnackbar(intl.formatMessage({
                                        id: `copy_clipboard`,
                                    }));
                                }}>
                                <CopyIcon
                                    size="1rem"
                                    color="#0E78D5" />
                            </IconButton>
                        </Tooltip>,
                    readOnly: true,
                    style: {
                        backgroundColor: `rgba(240, 240, 240, 0.8)`,
                        borderRadius: 12,
                        fontSize: `1em`,
                    },
                }}
            />
        </Grid>
    </>;
}
