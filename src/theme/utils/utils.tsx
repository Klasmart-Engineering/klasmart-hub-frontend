
import { fallbackLocale } from "@/locale/config";
import {
    localeState,
    useGlobalStateValue,
} from "@kl-engineering/frontend-state";
import { utils } from "@kl-engineering/kidsloop-px";
import {
    colors,
    Components,
    ThemeOptions,
} from "@mui/material";
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
import { TypographyOptions } from "@mui/material/styles/createTypography";

export const PRIMARY_THEME_COLOR = `#5A86EE`;

export function useThemeProvider () {
    const themeColor = PRIMARY_THEME_COLOR;
    const globalLocale = useGlobalStateValue(localeState);

    const locale = globalLocale ?? fallbackLocale.locale;

    function setTypography () {
        let localeFontFamily = `Source Sans Pro`;
        const localeWeightLight = 400;
        const localeWeightMedium = 600;
        let localeWeightRegular = 600;
        const localeWeightBold = 700;

        switch (locale) {
        case `en`:
            localeFontFamily = `Source Sans Pro`;
            localeWeightRegular = 600;
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
    const typography: TypographyOptions = {
        button: {
            textTransform: `none`,
        },
        fontFamily: localeTypography.localeFontFamily,
        fontWeightBold: localeTypography.localeWeightBold,
        fontWeightLight: localeTypography.localeWeightLight,
        fontWeightMedium: localeTypography.localeWeightMedium,
        fontWeightRegular: localeTypography.localeWeightRegular,
        allVariants: {
            letterSpacing: -0.5,
        },
    };

    const breakpoints: ThemeOptions['breakpoints'] = {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1200,
            xl: 1920,
        },
    };

    const components: Components<Theme> = {
        MuiYearPicker: {
            styleOverrides: {
                root: {
                    "& .Mui-selected": {
                        "&:focus": {
                            color: colors.common.white,
                        },
                        "&:hover": {
                            color: colors.common.white,
                        },
                    },
                },
            },
        },
        MuiMonthPicker: {
            styleOverrides: {
                root: {
                    "& .Mui-selected": {
                        "&:focus": {
                            color: colors.common.white,
                        },
                        "&:hover": {
                            color: colors.common.white,
                        },
                    },
                },
            },
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        "&:focus": {
                            color: `#FFF`,
                        },
                        "&:hover": {
                            color: `#FFF`,
                        },
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontWeight: 500,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: `none`,
                    borderBottom: `1px solid #E4E4E4`,
                    height: 50,
                },
                colorPrimary: {
                    color: colors.common.black,
                    backgroundColor: colors.common.white,
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    backgroundColor: `#fff`,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                stickyHeader: {
                    backgroundColor: `#fafafa`,
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    backgroundColor: `#FFF`,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    backgroundColor: `#fafafa`,
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    color: `#1B365D`,
                    backgroundColor: `#FFF`,
                    "&:hover": {
                        "-webkit-transition": `all .4s ease`,
                        color: `#FFF`,
                        backgroundColor: `#1B365D`,
                        "box-shadow": `0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)`,
                        transition: `all .4s ease`,
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    color: `#E4E4E4`,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                outlined: {
                    borderRadius: 10,
                },
                root: {
                    boxShadow: `0px 2px 6px rgba(0, 0, 0, 0.1)`,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    boxShadow: `none`,
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                root: {
                    boxShadow: `0px 2px 6px rgba(0, 0, 0, 0.1)`,
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    paddingLeft: 12,
                    paddingRight: 12,
                    minHeight: 50,
                    height: 50,
                    '@media (min-width: 0px)': {
                        paddingLeft: 12,
                        paddingRight: 12,
                        minHeight: 50,
                    },
                    '@media (min-width: 600px)': {
                        paddingLeft: 12,
                        paddingRight: 12,
                        minHeight: 50,
                    },
                },
            },
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    lineHeight: 3,
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
        mode: `light`,
        background: {
            default: colors.common.white,
            paper: colors.common.white,
        },
        primary: {
            contrastText: getContrastColor(themeColor),
            main: themeColor,
            light: lighten(themeColor, 0.9),
            dark: darken(themeColor, 0.75),
        },
        secondary: {
            main: themeColor,
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

    const theme = createTheme({
        breakpoints,
        components,
        palette,
        typography,
    });

    return responsiveFontSizes(theme);
}
