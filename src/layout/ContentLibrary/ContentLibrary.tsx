import BadanamuContentPage from "@/pages/library/badanamu-content";
import MoreFeaturedContentPage from "@/pages/library/more-featured-content";
import OrganizationContentPage from "@/pages/library/organization-content";
import { Tabs } from "@kl-engineering/kidsloop-px";
import { Tab } from "@kl-engineering/kidsloop-px/dist/src/components/Tabs";
import { Theme } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { useIntl } from "react-intl";
import {
    Redirect,
    Route,
    Switch,
    useLocation,
    useRouteMatch,
} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    tabs: {
        padding: theme.spacing(0, 2),
    },
    tabContent: {
        width: `100%`,
        height: `calc(100% - ${theme.spacing(6)})`, // minus height of tabs toolbar
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
    const { path, url } = useRouteMatch();
    const intl = useIntl();

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
            path: `${path}/organization-content`,
        },
        {
            id: `Badanamu Content`,
            path: `${path}/badanamu-content`,
        },
        {
            id: `More Featured Content`,
            path: `${path}/more-featured-content`,
        },
    ] as ContentTab[]).map((tab) => ({
        text: intl.formatMessage({
            id: getTranslationIdByPageId(tab.id),
        }),
        value: tab.path,
    }));

    return (
        <>
            <Tabs
                valuesAsPaths
                className={classes.tabs}
                tabs={tabs}
                value={location.pathname}
            />
            <Switch>
                <Route
                    exact
                    path={path}
                >
                    <Redirect to={`${path}/organization-content`} />
                </Route>
                <Route path={`${path}/organization-content`}>
                    <OrganizationContentPage className={classes.tabContent} />
                </Route>
                <Route path={`${path}/badanamu-content`}>
                    <BadanamuContentPage className={classes.tabContent} />
                </Route>
                <Route path={`${path}/more-featured-content`}>
                    <MoreFeaturedContentPage className={classes.tabContent} />
                </Route>
            </Switch>
        </>
    );
};

export default ContentLibraryLayout;
