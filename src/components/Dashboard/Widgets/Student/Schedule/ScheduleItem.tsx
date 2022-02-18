import { MockClass } from "./mockDataClasses";
import NextClassThumb from "@/assets/img/mock/next_class_thumb.png";
import { retrieveClassTypeIdentityOrDefault } from "@/config/classTypes";
import { THEME_COLOR_CLASS_TYPE_LIVE } from "@/config/index";
import {
    Box,
    Chip,
    darken,
    Divider,
    Grid,
    SvgIcon,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import { UserAvatar } from "kidsloop-px";
import React from "react";
import {
    FormattedDate,
    FormattedMessage,
    useIntl,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";
import { withResizeDetector } from "react-resize-detector";
import { ReactResizeDetectorDimensions } from "react-resize-detector/build/ResizeDetector";

const SHOW_IMAGE_BREAKPOINT = 500;

interface Props extends ReactResizeDetectorDimensions {
    mockClass: MockClass;
    active: boolean;
}

export interface StyleProps {
    classTypeTheme: string;
    isActive: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(((theme: Theme) => createStyles({
    root: {
        border: ({ classTypeTheme }) => `2px solid ${ classTypeTheme }`,
        borderRadius: `15px`,
        padding: theme.spacing(1),
        background: ({ isActive }) => isActive ? THEME_COLOR_CLASS_TYPE_LIVE : `transparent`,
    },
    title: {
        color: ({ classTypeTheme }) => `${ classTypeTheme }`,
    },
    chip: {
        backgroundColor:  ({ classTypeTheme, isActive }) => isActive ? darken(THEME_COLOR_CLASS_TYPE_LIVE, .2) : `${ classTypeTheme }`,
        color: theme.palette.common.white,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        "& .MuiSvgIcon-root": {
            color: theme.palette.common.white,
        },
    },
    imageContainer: {
        position: `relative`,
        maxWidth: `125px`,
        borderRadius: `10px`,
        overflow: `hidden`,
    },
    image: {
        width: `100%`,
        height: `100%`,
        objectFit: `cover`,
    },
    timeLabel: {
        paddingTop: theme.spacing(.5),
        color: ({ classTypeTheme }) => `${ classTypeTheme }`,
    },
    durationLabel: {
        color: ({ classTypeTheme }) => `${ classTypeTheme }`,
    },
    teacherName: {
        color: ({ isActive }) => isActive ? theme.palette.common.white : theme.palette.grey[700],
        paddingLeft: theme.spacing(.5),
    },
})));

function ScheduleItem (props: Props) {
    const {
        width,
        mockClass,
        active,
    } = props;
    const showImage = width ? width > SHOW_IMAGE_BREAKPOINT : false;
    const classIdentity = retrieveClassTypeIdentityOrDefault(mockClass.type);

    const intl = useIntl();
    const classes = useStyles({
        classTypeTheme: active ? `white` : classIdentity.color,
        isActive: active,
    });

    return (
        <Box className={ classes.root }>
            <Grid
                container
                alignItems="stretch"
                wrap="nowrap"
            >
                { showImage && (
                    <Grid
                        item
                        xs={3}
                        className={ classes.imageContainer }
                    >
                        <img
                            className={ classes.image }
                            src={NextClassThumb} />
                    </Grid>)}
                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    paddingX={ showImage ? 2 : 0}
                >
                    <Grid
                        container
                        justifyContent="space-between">
                        <div>
                            <Chip
                                size="small"
                                className={classes.chip}
                                icon={ <SvgIcon
                                    component={classIdentity.icon} /> }
                                label={ classIdentity.intlKey } />
                            <Typography
                                variant="h6"
                                className={ classes.title }>
                                <FormattedMessage id={mockClass.titleKey} />
                            </Typography>
                        </div>
                        <Typography
                            noWrap
                            variant="body2"
                            className={classes.timeLabel}>
                            <FormattedDate
                                value={mockClass.startTime}
                                hour12={true}
                                hour="2-digit"
                                minute="2-digit"
                            />
                        </Typography>
                    </Grid>
                    <Divider className={classes.divider} />
                    <Box>

                        <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center">
                            <div className={ classes.teacherList }>
                                <Box paddingTop={1}>
                                    <Grid
                                        container
                                        spacing={1}>
                                        { mockClass.teachers.map((teacher, i) => (
                                            <Grid
                                                key={`teacher-${i}`}
                                                item
                                                className={classes.teacher}>
                                                <Box
                                                    display="flex"
                                                    flexDirection="row"
                                                    alignItems="center"
                                                >
                                                    <UserAvatar
                                                        name={`${ teacher.givenNameKey } ${ teacher.surnameKey }`}
                                                        className={classes.avatar}
                                                        size="small"
                                                        src={ teacher.image }
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        className={ classes.teacherName }>
                                                        <FormattedMessage id={ teacher.givenNameKey } />
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))
                                        }
                                    </Grid>
                                </Box>
                            </div>
                            <div>
                                <Typography
                                    noWrap
                                    variant="body1"
                                    fontWeight="bold"
                                    className={classes.durationLabel}>
                                    <FormattedDuration
                                        seconds={ mockClass.duration * 60 }
                                        format="{hours} {minutes}"
                                    />
                                </Typography>
                            </div>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default withResizeDetector(ScheduleItem);
