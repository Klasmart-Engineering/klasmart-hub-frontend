import { useCurrentOrganization } from "./store/organizationMemberships";
import { usePreviewOrganizationColor } from "./store/previewOrganizationColor";
import { State } from "./store/store";
import { getLanguage } from "./utils/locale";
import {
    blue,
    green,
    orange,
    red,
} from "@mui/material/colors";
import {
    createTheme,
    darken,
    lighten,
    PaletteOptions,
    responsiveFontSizes,
    Theme,
} from "@mui/material/styles";
import { utils } from "kidsloop-px";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export const PRIMARY_THEME_COLOR = `#0094FF`;

export function themeProvider () {
    const themeMode = useSelector((state: State) => state.ui.darkMode);
    const languageCode = useSelector((state: State) => state.ui.locale || ``);
    const [ cookies ] = useCookies([ `locale` ]);
    const currentOrganization = useCurrentOrganization();
    const [ previewOrganizationColor ] = usePreviewOrganizationColor();

    const organizationName = currentOrganization?.name ?? ``;
    const organizationPrimaryColor = currentOrganization?.branding?.primaryColor ?? (organizationName ? utils.stringToColor(organizationName) : PRIMARY_THEME_COLOR);
    const locale = cookies.locale ?? getLanguage(languageCode).locale;

    function setTypography () {
        let localeFontFamily = `Inter`;
        const localeWeightLight = 400;
        const localeWeightMedium = 600;
        let localeWeightRegular = 500;
        const localeWeightBold = 700;

        switch (locale) {
        case `en`:
            localeFontFamily = `Inter`;
            localeWeightRegular = 500;
            break;
        case `ko`:
            localeFontFamily = `NanumSquareRound`;
            localeWeightRegular = 600;
            break;
        case `zh-CN`:
            localeFontFamily = `Source Han Sans SC`;
            break;
        default:
            break;
        }
        localeFontFamily = [
            localeFontFamily,
            `-apple-system`,
            `Segoe UI`,
            `Helvetica`,
            `sans-serif`,
        ].join(`,`);
        return {
            localeFontFamily,
            localeWeightLight,
            localeWeightMedium,
            localeWeightRegular,
            localeWeightBold,
        };
    }

    const localeTypography = setTypography();
    const typography = {
        button: {
            textTransform: `none`,
        },
        fontFamily: localeTypography.localeFontFamily,
        fontWeightBold: localeTypography.localeWeightBold,
        fontWeightLight: localeTypography.localeWeightLight,
        fontWeightMedium: localeTypography.localeWeightMedium,
        fontWeightRegular: localeTypography.localeWeightRegular,
    } as any;

    const organizationColor = previewOrganizationColor ?? organizationPrimaryColor;
    const organizationToolbarColor = lighten(organizationColor, 0.9);

    const breakpointOverrides = {
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1200,
                xl: 1920,
            },
        },
    };

    const componentOverrides = {
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        fontSize: `0.875rem`,
                        lineHeight: 1.43,
                        fontWeight: 500,
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    colorPrimary: {
                        color: `#000`,
                        backgroundColor: themeMode === `light` ? organizationToolbarColor : `#041125`,
                    },
                },
            },
            MuiTable: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === `light` ? `#fff` : `#05152e`,
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    stickyHeader: {
                        backgroundColor: themeMode === `light` ? `#fafafa` : `#041125`,
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === `light` ? `#FFF` : `#030D1C`,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === `light` ? `#fafafa` : `#030D1C !important`,
                    },
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        color: themeMode === `light` ? `#1B365D` : `#FFF`,
                        backgroundColor: themeMode === `light` ? `#FFF` : `#1B365D`,
                        "&:hover": {
                            "-webkit-transition": `all .4s ease`,
                            color: themeMode === `light` ? `#FFF` : `#030D1C`,
                            backgroundColor: themeMode === `light` ? `#1B365D` : `#FFF`,
                            "box-shadow": `0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)`,
                            transition: `all .4s ease`,
                        },
                    },
                },
            },
        },
    };

    const getContrastColor = (color: string) => {
        return utils.getContrastColor(color, {
            lightColor: color,
        });
    };

    const palette: PaletteOptions = {
        background: {
            default: themeMode === `light` ? `#fafafa` : `#030D1C`,
            paper: themeMode === `light` ? `#FFF` : `#030D1C`,
        },
        primary: {
            contrastText: getContrastColor(organizationColor),
            main: organizationColor,
            light: lighten(organizationColor, 0.9),
            dark: darken(organizationColor, 0.75),
        },
        secondary: {
            main: organizationColor,
        },
        error: {
            contrastText: getContrastColor(red[500]),
            main: red[500],
        },
        info: {
            contrastText: getContrastColor(blue[500]),
            main: blue[500],
        },
        success: {
            contrastText: getContrastColor(green[500]),
            main: green[500],
        },
        warning: {
            contrastText: getContrastColor(orange[500]),
            main: orange[500],
        },
    };

    let theme: Theme;
    if (themeMode === `light`) {
        palette.mode = `light`;
        palette.background = {
            default: `#FFF`,
        };
        theme = createTheme({
            ...componentOverrides,
            ...breakpointOverrides,
            palette,
            typography,
        });
    } else {
        palette.mode = `dark`;
        theme = createTheme({
            ...componentOverrides,
            ...breakpointOverrides,
            palette,
            typography,
        });
    }

    return responsiveFontSizes(theme);
}
