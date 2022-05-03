import { useCurrentOrganization } from "@/state/organizationMemberships";
import { usePreviewOrganizationColor } from "@/state/previewOrganizationColor";
import {
    localeState,
    useStateValue,
} from "@kl-engineering/frontend-state";
import { utils } from "@kl-engineering/kidsloop-px";
import { colors } from "@mui/material";
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
} from "@mui/material/styles";

export const PRIMARY_THEME_COLOR = `#0094FF`;

export function useThemeProvider () {
    const locale = useStateValue(localeState);
    const currentOrganization = useCurrentOrganization();
    const [ previewOrganizationColor ] = usePreviewOrganizationColor();

    const organizationName = currentOrganization?.name ?? ``;
    const organizationPrimaryColor = currentOrganization?.branding?.primaryColor ?? (organizationName ? utils.stringToColor(organizationName) : PRIMARY_THEME_COLOR);

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
            MuiYearPicker: {
                styleOverrides: {
                    root: {
                        "& .Mui-selected": {
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
            MuiMonthPicker: {
                styleOverrides: {
                    root: {
                        "& .Mui-selected": {
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
                        backgroundColor: organizationToolbarColor,
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

    const theme = createTheme({
        ...componentOverrides,
        ...breakpointOverrides,
        palette,
        typography,
    });

    return responsiveFontSizes(theme);
}
