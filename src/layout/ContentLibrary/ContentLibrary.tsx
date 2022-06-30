/* eslint-disable react/prop-types */
import { TabTitle } from "@/utils/tabTitle";
import { Tabs } from "@kl-engineering/kidsloop-px";
import { Tab } from "@kl-engineering/kidsloop-px/dist/src/components/Tabs";
import { Theme } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { useIntl } from "react-intl";
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    tabs: {
        padding: theme.spacing(0, 2),
    },
}));

type ContentLibraryPage = `Badanamu Content` | `Organization Content` | `More Featured Content`;

interface ContentTab {
    id: ContentLibraryPage;
    path: string;
}

interface ContentLibraryLayoutProps {
}

const ContentLibraryLayout: React.VFC<ContentLibraryLayoutProps> = (props) => {
    const classes = useStyles();
    const location = useLocation();
    const intl = useIntl();
    const basePath = `/library`;

    const getTranslationIdByPageId = (id: ContentLibraryPage) => {
        switch (id) {
        case `Badanamu Content`: return `navbar_BadanamuContentTab`;
        case `More Featured Content`: return `navbar_MoreFeaturedContentTab`;
        case `Organization Content`: return `navbar_OrganizationContentTab`;
        }
    };

    const tabs: Tab[] = ([
        {
            id: `Organization Content`,
            path: `${basePath}/organization-content`,
        },
        {
            id: `Badanamu Content`,
            path: `${basePath}/badanamu-content`,
        },
        {
            id: `More Featured Content`,
            path: `${basePath}/more-featured-content`,
        },
    ] as ContentTab[]).map((tab) => ({
        text: intl.formatMessage({
            id: getTranslationIdByPageId(tab.id),
        }),
        value: tab.path,
    }));

    if (location.pathname.endsWith(basePath)) return (
        <Navigate
            replace
            to={tabs[0].value ?? ``}
        />
    );

    TabTitle(`Kidsloop | Interactive Digital Platform for Education | Content Library`);

    return (
        <>
            <Tabs
                valuesAsPaths
                className={classes.tabs}
                tabs={tabs}
                value={location.pathname}
            />
            <Outlet />
        </>
    );
};

export default ContentLibraryLayout;
