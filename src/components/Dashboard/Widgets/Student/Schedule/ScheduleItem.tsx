import { useGetClassNodeRoster } from "@/api/classRoster";
import NextClassThumb from "@/assets/img/mock/next_class_thumb.png";
import { retrieveClassTypeIdentityOrDefault } from "@/config/classTypes";
import { THEME_COLOR_CLASS_TYPE_LIVE } from "@/config/index";
import { SchedulePayload } from "@/types/objectTypes";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
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
import React from "react";
import { FormattedDate } from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";
import { withResizeDetector } from "react-resize-detector";
import { ReactResizeDetectorDimensions } from "react-resize-detector/build/ResizeDetector";

const SHOW_IMAGE_BREAKPOINT = 500;

interface Props extends ReactResizeDetectorDimensions {
    item: SchedulePayload;
    active: boolean;
}

export interface StyleProps {
    classTypeTheme: string;
    isActive: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(((theme: Theme) => createStyles({
    root: {
        border: ({ classTypeTheme }) => `2px solid ${classTypeTheme}`,
        borderRadius: `15px`,
        padding: theme.spacing(1),
        background: ({ isActive }) => isActive ? THEME_COLOR_CLASS_TYPE_LIVE : `transparent`,
    },
    title: {
        color: ({ classTypeTheme }) => `${classTypeTheme}`,
    },
    chip: {
        backgroundColor: ({ classTypeTheme, isActive }) => isActive ? darken(THEME_COLOR_CLASS_TYPE_LIVE, .2) : `${classTypeTheme}`,
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
        color: ({ classTypeTheme }) => `${classTypeTheme}`,
    },
    durationLabel: {
        color: ({ classTypeTheme }) => `${classTypeTheme}`,
    },
    teacherName: {
        color: ({ isActive }) => isActive ? theme.palette.common.white : theme.palette.grey[700],
        paddingLeft: theme.spacing(.5),
    },
})));

const getClassType = ({
    class_type: classType,
    is_review: isReview,
    is_home_fun: isHomeFun,
}: SchedulePayload) => {
    if(classType === `Homework` && isReview) {
        return `StudyAutoReview`;
    } else if(classType === `Homework` && !isHomeFun) {
        return `Study`;
    }
    return classType;
};

function ScheduleItem (props: Props) {
    const {
        width,
        item,
        active,
    } = props;
    const showImage = width ? width > SHOW_IMAGE_BREAKPOINT : false;
    const classType = getClassType(item);
    const classIdentity = retrieveClassTypeIdentityOrDefault(classType);
    const classes = useStyles({
        classTypeTheme: active ? `white` : classIdentity.color,
        isActive: active,
    });
    const maxTeachers = 2;
    const { data: rosterData } = useGetClassNodeRoster({
        fetchPolicy: `no-cache`,
        variables: {
            id: item?.class_id ?? ``,
            count: maxTeachers,
            orderBy: `familyName`,
            order: `ASC`,
            direction: `FORWARD`,
            showStudents: false,
            showTeachers: true,
        },
        skip: !item?.class_id,
    });

    return (
        <Box className={classes.root}>
            <Grid
                container
                alignItems="stretch"
                wrap="nowrap"
            >
                {showImage && (
                    <Grid
                        item
                        xs={3}
                        className={classes.imageContainer}
                    >
                        <img
                            alt=""
                            className={classes.image}
                            src={NextClassThumb}
                        />
                    </Grid>)}
                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    paddingX={showImage ? 2 : 0}
                >
                    <Grid
                        container
                        justifyContent="space-between"
                    >
                        <div>
                            <Chip
                                size="small"
                                className={classes.chip}
                                icon={<SvgIcon component={classIdentity.icon} />}
                                label={classIdentity.intlKey}
                            />
                            <Typography
                                variant="h6"
                                className={classes.title}
                            >
                                {item.title}
                            </Typography>
                        </div>
                        <Typography
                            noWrap
                            variant="body2"
                            className={classes.timeLabel}
                        >
                            <FormattedDate
                                hour12
                                value={item.start_at * 1000}
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
                            alignItems="center"
                        >
                            <div className={classes.teacherList}>
                                <Box paddingTop={1}>
                                    <Grid
                                        container
                                        alignItems="baseline"
                                    >
                                        {rosterData?.classNode.teachersConnection?.edges.map((edge, i) => {
                                            return (
                                                <Grid
                                                    key={edge.node.id}
                                                    item
                                                    className={classes.teacher}
                                                >
                                                    {(rosterData?.classNode?.teachersConnection?.totalCount ?? 0) <= maxTeachers &&
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                            className="singleTeacher"
                                                        >
                                                            <UserAvatar
                                                                name={`${edge.node.givenName} ${edge.node.familyName}`}
                                                                className={classes.avatar}
                                                                size="small"
                                                            />
                                                            <span style={{
                                                                display: `inline-block`,
                                                                paddingLeft: `0.5em`,
                                                                paddingRight: `0.5em`,
                                                            }}
                                                            >{edge.node.givenName} {edge.node.familyName}
                                                            </span>
                                                        </Box>}
                                                    {(rosterData?.classNode?.teachersConnection?.totalCount ?? 0) > maxTeachers &&
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            paddingRight="1em"
                                                            paddingBottom="1em"
                                                        >
                                                            <UserAvatar
                                                                name={`${edge.node.givenName} ${edge.node.familyName}`}
                                                                className={classes.avatar}
                                                                size="small"
                                                            />
                                                            <Typography variant="caption">
                                                                {edge.node.givenName}
                                                            </Typography>
                                                            {i === maxTeachers - 1 && <Typography variant="caption">
                                                                <span style={{
                                                                    display: `inline-block`,
                                                                    paddingLeft: `1em`,
                                                                }}
                                                                > + {rosterData?.classNode.teachersConnection?.totalCount - maxTeachers}
                                                                </span>

                                                                                      </Typography>}
                                                        </Box>
                                                    }
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            </div>
                            <div>
                                <Typography
                                    noWrap
                                    variant="body1"
                                    fontWeight="bold"
                                    className={classes.durationLabel}
                                >
                                    <FormattedDuration
                                        seconds={item.end_at - item.start_at}
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
