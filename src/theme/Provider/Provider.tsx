/* eslint-disable react/prop-types */
import {
    localeState,
    useGlobalStateValue,
} from "@kl-engineering/frontend-state";
import {
    buildTheme,
    ThemeProvider as PXThemeProvider,
} from "@kl-engineering/kidsloop-px";
import { useMemo } from "react";

interface ThemeProviderProps {
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
    const locale = useGlobalStateValue(localeState);
    const theme = useMemo(() => buildTheme({
        locale,
    }), [ locale ]);

    return (
        <PXThemeProvider theme={theme}>
            {props.children}
        </PXThemeProvider>
    );
};

export default ThemeProvider;
