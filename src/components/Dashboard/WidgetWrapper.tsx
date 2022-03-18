import { WidgetType } from './models/widget.model';
import WidgetWrapperError from './WidgetManagement/WidgetWrapperError';
import WidgetWrapperNoData from './WidgetManagement/WidgetWrapperNoData';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
    Box,
    Card,
    CircularProgress,
    Link,
    Typography,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
    ClassNameMap,
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from 'react';

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
    titleEditing: {
        fontSize: 14,
        fontWeight: `bold`,
        color: theme.palette.grey[100],
    },
    titleLink: {
        display: `flex`,
        alignItems: `center`,
        fontSize: 12,
        color: theme.palette.grey[500],
    },
    icon: {
        height: `35px`,
        width: `35px`,

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
    error?: any;
    noData?: boolean;
    reload?: () => any | Promise<any>;
    id: WidgetType;
}

export default function WidgetWrapper (props: BaseWidgetProps) {
    const classes = useStyles();
    const {
        children,
        label,
        link,
        overrideLink,
        loading,
        error,
        noData,
        reload,
        id,
    } = props;

    return (
        <Box className={classes.cardWrapper}>
            <CardAnnotation
                classes={classes}
                label={label}
                link={link}
                overrideLink={overrideLink}
                id={id}
            />
            <Card
                className={classes.card}
            >
                <Box sx={
                    loading ? {
                        m: `auto`,
                        display: `flex`,
                        alignItems: `center`,
                    } :
                        {
                            height: `100%`,
                        }
                }>
                    {loading ?
                        <CircularProgress color="primary" />
                        : error ?
                            <WidgetWrapperError reload={reload}/>
                            : noData ?
                                <WidgetWrapperNoData/>
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
    id: WidgetType;
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
                        color="primary"
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
