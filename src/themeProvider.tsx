import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
import "inter-ui";
import { useCurrentOrganization } from "./store/organizationMemberships";
import { State } from "./store/store";
import { getLanguage } from "./utils/locale";
import {
    blue,
    green,
    orange,
    red,
} from "@material-ui/core/colors";
import {
    createMuiTheme,
    responsiveFontSizes,
    Theme,
} from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { utils } from "kidsloop-px";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export function themeProvider () {
    const themeMode = useSelector((state: State) => state.ui.darkMode);
    const languageCode = useSelector((state: State) => state.ui.locale || ``);
    const [ cookies ] = useCookies([ `locale` ]);
    const currentOrganization = useCurrentOrganization();

    const organizationName = currentOrganization?.organization_name ?? ``;
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

    const organizationToolbarColor = utils.stringToColor(organizationName, {
        saturation: 50,
        light: 90,
    });

    const overrides = {
        MuiAppBar: {
            colorPrimary: {
                color: `#000`,
                backgroundColor: themeMode === `light` ? organizationToolbarColor : `#041125`,
            },
        },
        MuiTable: {
            root: {
                backgroundColor: themeMode === `light` ? `#fff` : `#05152e`,
            },
        },
        MuiTableCell: {
            stickyHeader: {
                backgroundColor: themeMode === `light` ? `#fafafa` : `#041125`,
            },
        },
        MuiTabs: {
            root: {
                backgroundColor: themeMode === `light` ? `#FFF` : `#030D1C`,
            },
        },
        MuiTab: {
            root: {
                backgroundColor: themeMode === `light` ? `#fafafa` : `#030D1C !important`,
            },
        },
        MuiToggleButton: {
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
    };

    const organizationColor = utils.stringToColor(organizationName);

    const palette: PaletteOptions = {
        background: {
            default: themeMode === `light` ? `#fafafa` : `#030D1C`,
            paper: themeMode === `light` ? `#FFF` : `#030D1C`,
        },
        primary: {
            contrastText: `#FFF`,
            main: organizationColor,
            light: utils.stringToColor(organizationName, {
                saturation: 50,
                light: 95,
            }),
            dark: utils.stringToColor(organizationName, {
                saturation: 50,
                light: 25,
            }),
        },
        secondary: {
            main: organizationColor,
        },
        error: {
            contrastText: `#FFF`,
            main: red[500],
        },
        info: {
            contrastText: `#FFF`,
            main: blue[500],
        },
        success: {
            contrastText: `#FFF`,
            main: green[500],
        },
        warning: {
            contrastText: `#FFF`,
            main: orange[500],
        },
    };

    let theme: Theme;
    if (themeMode === `light`) {
        palette.type = `light`;
        palette.background = {
            default: `#FFF`,
        };
        theme = createMuiTheme({
            overrides,
            palette,
            typography,
        });
    } else {
        palette.type = `dark`;
        theme = createMuiTheme({
            overrides,
            palette,
            typography,
        });
    }

    return theme = responsiveFontSizes(theme);
}
