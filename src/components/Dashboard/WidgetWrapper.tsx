import WidgetWrapperError from './WidgetManagement/WidgetWrapperError';
import WidgetWrapperNoData from './WidgetManagement/WidgetWrapperNoData';
import {
    Box,
    CircularProgress,
    createStyles,
    Link,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import React,
{ ReactElement } from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
    cardWrapper: {
        display: `flex`,
        flexFlow: `column`,
        height: `100%`,
    },
    card: {
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-between`,
        borderRadius: 10,
        boxShadow: `none`,
        padding: 15,
        height: `100%`,
    },
    titleContainer: {
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: `center`,
        padding: theme.spacing(1),

    },
    title: {
        fontSize: 14,
        fontWeight: `bold`,
        color: theme.palette.grey[600],
    },
    titleLink: {
        display: `flex`,
        alignItems: `center`,
        fontSize: 12,
        color: theme.palette.grey[500],
    },
}));

type LinkProps = {
    url: string;
    label: string;
}

export type BaseWidgetProps = {
    children: React.ReactNode;
    label: string;
    link?: LinkProps;
    overrideLink?: React.ReactNode;
    loading: boolean;
    error: any;
    noData: boolean;
    reload: () => any | Promise<any>;
}

export default function WidgetWrapper (props: BaseWidgetProps) {
    const classes = useStyles();
    const {
        children,
        label,
        link,
        overrideLink,
        reload,
    } = props;

    return (
        <Box className={classes.cardWrapper}>
            <CardAnnotation
                classes={classes}
                label={label}
                link={link}
                overrideLink={overrideLink} />
            <Card
                className={classes.card}
            >
                <Box sx={
                    props.loading ? {
                        m: `auto`,
                        display: `flex`,
                        alignItems: `center`,
                    } :
                        {
                            height: `100%`,
                        }
                }>
                    {props.loading ?
                        <CircularProgress color="primary" />
                        : props.error ?
                            <WidgetWrapperError reload={reload}/>
                            : props.noData ?
                                <WidgetWrapperNoData></WidgetWrapperNoData>
                                :
                                children
                    }
                </Box>
            </Card>
        </Box>
    );
}

type CardAnnotationProps = {
    classes: ClassNameMap;
    label: string;
    link?: LinkProps;
    overrideLink? : React.ReactNode;
}

function CardAnnotation ({
    classes,
    label,
    link,
    overrideLink,
}: CardAnnotationProps) {
    return (
        <Box className={classes.titleContainer}>
            <Typography className={classes.title}>{ label }</Typography>
            {
                link && !overrideLink && (
                    <Link
                        className={classes.titleLink}
                        href={`#${location.pathname}${link.url}`}
                        color="secondary"
                    >
                        { link.label} <PlayArrowIcon />
                    </Link>
                )
            }

            {
                overrideLink && (
                    <Box>
                        { overrideLink }
                    </Box>
                )
            }
        </Box>
    );
}
