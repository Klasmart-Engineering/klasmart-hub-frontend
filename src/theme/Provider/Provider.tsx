/* eslint-disable react/prop-types */
import { useThemeProvider } from "@/theme/utils/utils";
import { ThemeProvider as MUIThemeProvider } from "@mui/material";

interface ThemeProviderProps {
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
    const theme = useThemeProvider();

    return (
        <MUIThemeProvider theme={theme}>
            {props.children}
        </MUIThemeProvider>
    );
};

export default ThemeProvider;
