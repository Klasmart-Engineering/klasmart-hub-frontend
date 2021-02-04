import { useRestAPI } from "@/api/restapi";
import { currentMembershipVar } from "@/cache";
import { useReactiveVar } from "@apollo/client";
import {
    Breadcrumbs,
    createStyles,
    Link,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Home as HomeIcon } from "@material-ui/icons";
import { useWidth } from "kidsloop-px";
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
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
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
                org_id: organization_id,
            });
            updatedPathNames.set(path, pathDetails.name);
        }));
        setPathNames(updatedPathNames);
    };

    useEffect(() => {
        const paths = location.pathname.replace(root, ``).split(`/`).filter((path) => !!path);
        if (!organization_id || !paths.length) return;
        fetchPathNames(paths);
    }, [ organization_id, location ]);

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
                    </Link>,
                )}
                {(paths?.length ?? 0) > 0 &&
                    <Typography>{pathNames.get(paths[paths.length - 1]) ?? `...`}</Typography>
                }
            </Breadcrumbs>
        </>
    );
}
