import { useThemeProvider } from "@/themeProvider";
import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
} from "@kl-engineering/kidsloop-px";
import {
    CssBaseline,
    StyledEngineProvider,
    ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import React from "react";

interface ThemeProviderProps {
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
    const theme = useThemeProvider();
    return (
        <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <ConfirmDialogProvider>
                    <PromptDialogProvider>
                        <AlertDialogProvider>
                            <SnackbarProvider closeButtonLabel="Dismiss">
                                <CssBaseline />
                                {props.children}
                            </SnackbarProvider>
                        </AlertDialogProvider>
                    </PromptDialogProvider>
                </ConfirmDialogProvider>
            </MuiThemeProvider>
        </StyledEngineProvider>
    );
};

export default ThemeProvider;
