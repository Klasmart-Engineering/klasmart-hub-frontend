import { useRestAPI } from "@/api/restapi";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Home as HomeIcon } from "@mui/icons-material";
import {
    Breadcrumbs,
    Link,
    Typography,
} from "@mui/material";
import { Breakpoint } from '@mui/material/styles';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { useWidth } from "@kl-engineering/kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import {
    useLocation,
    useRouteMatch,
} from "react-router";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    },
    link: {
        display: `flex`,
    },
}));

interface Props {
}

const getMaxCount = (breakpoint: Breakpoint) => {
    switch (breakpoint) {
    case `xs`: return 2;
    case `sm`: return 4;
    case `md`: return 7;
    case `lg`:
    case `xl`: return 11;
    }
};

const getCountAfterCollapse = (breakpoint: Breakpoint) => {
    switch (breakpoint) {
    case `xs`: return 1;
    case `sm`: return 3;
    case `md`: return 6;
    case `lg`:
    case `xl`: return 10;
    }
};

export default function TableBreadcrumbs (props: Props) {
    const classes = useStyles();
    const route = useRouteMatch();
    const location = useLocation();
    const restApi = useRestAPI();
    const breakpoint = useWidth();
    const currentOrganization = useCurrentOrganization();
    const root = route.path;
    const paths = location.pathname.replace(root, ``).split(`/`).filter((path) => !!path);
    const [ pathNames, setPathNames ] = useState(new Map<string, string | undefined>());

    const fetchPathNames = async (paths: string[]) => {
        const updatedPathNames = new Map(pathNames);
        await Promise.all(paths.map(async (path) => {
            const pathName = updatedPathNames.get(path);
            if (pathName) return;
            const pathDetails = await restApi.getFolderItemsDetailsById({
                folder_id: path,
                org_id: currentOrganization?.id ?? ``,
            });
            updatedPathNames.set(path, pathDetails.name);
        }));
        setPathNames(updatedPathNames);
    };

    useEffect(() => {
        const paths = location.pathname.replace(root, ``).split(`/`).filter((path) => !!path);
        if (!currentOrganization || !paths.length) return;
        fetchPathNames(paths);
    }, [ currentOrganization, location ]);

    return (
        <>
            <Breadcrumbs
                className={classes.root}
                maxItems={getMaxCount(breakpoint)}
                itemsAfterCollapse={getCountAfterCollapse(breakpoint)}
                itemsBeforeCollapse={1}
            >
                <Link
                    href={paths.length ? `#${root}` : undefined}
                    className={classes.link}
                    color={!paths.length ? `inherit` : undefined}
                >
                    <HomeIcon />
                </Link>
                {paths?.slice(0, paths.length - 1).map((path, i) =>
                    <Link
                        key={`path-${i}`}
                        href={`#${root}/${paths.slice(0, i + 1).join(`/`)}`}
                        className={classes.link}
                    >
                        <Typography>{pathNames.get(path) ?? `...`}</Typography>
                    </Link>)}
                {(paths?.length ?? 0) > 0 &&
                    <Typography>{pathNames.get(paths[paths.length - 1]) ?? `...`}</Typography>
                }
            </Breadcrumbs>
        </>
    );
}
