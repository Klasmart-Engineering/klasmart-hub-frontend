import NextClassThumb from "@/assets/img/mock/next_class_thumb.png";
import christina from "@/assets/img/teacher_christina.png";
import { THEME_COLOR_CLASS_TYPE_LIVE } from "@/config/index";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import {
    Box,
    Chip,
    darken,
    Divider,
    Fab,
    Grid,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import clsx from "clsx";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import React  from "react";
import {
    FormattedDate,
    FormattedMessage,
    useIntl,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";
import { withResizeDetector } from "react-resize-detector";
import { ReactResizeDetectorDimensions } from "react-resize-detector/build/ResizeDetector";

const VERTICAL_MODE_BREAKPOINT = 600;
const LARGE_TEXT_BREAKPOINT = 900;
const now = new Date();
const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);

export interface StyleProps {
    isVerticalMode: boolean;
    smallTextInHorizontal: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(((theme: Theme) => createStyles({
    root: {
        backgroundColor: THEME_COLOR_CLASS_TYPE_LIVE,
        borderRadius: `30px 10px 30px 30px`,
        padding: theme.spacing(2),
    },
    imageContainer: {
        position: `relative`,
        maxHeight: ({ isVerticalMode }) => isVerticalMode ? `220px` : `initial`,
        maxWidth: ({ isVerticalMode }) => isVerticalMode ? `initial` : `300px`,
        borderRadius: `25px 10px 25px 25px`,
        overflow: `hidden`,
    },
    image: {
        width: `100%`,
        height: `100%`,
        objectFit: `cover`,
    },
    content: {
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-between`,
        height: `100%`,
        padding: ({ isVerticalMode }) => isVerticalMode ? theme.spacing(2, 0, 0) : theme.spacing(0, 2),
        color: theme.palette.common.white,
    },
    darkChip: {
        background: `rgba(0, 0, 0, 0.3)`,
        color: `#fff`,
    },
    titleIcon: {
        fontSize: `2.5em`,
        marginRight: theme.spacing(2),
    },
    divider: {
        background:  theme.palette.grey[400],
        opacity: .7,
        width: `100%`,
    },
    classDetails: {
        display: `flex`,
        flexDirection: ({ isVerticalMode }) => isVerticalMode ? `column` : `row`,
        justifyContent: `space-between`,
        alignItems: ({ isVerticalMode }) => isVerticalMode ? `flex-start` : `flex-end`,
        width: `100%`,
    },
    teacherList: {
        padding: ({ isVerticalMode }) => isVerticalMode ? theme.spacing(2, 0) : theme.spacing(2, 0, 0),
    },
    teacher: {
        "& .singleTeacher": {
            paddingRight: 10,
            marginRight: 10,
            marginTop: 5,
        },
        "&:last-of-type .singleTeacher": {
            borderRight: 0,
            paddingRight: 0,
            marginRight: 0,
            marginBottom: 0,
        },
    },
    avatar: {
        color: `white`,
        marginRight: theme.spacing(1),
    },
    liveButtonContainer: {
        display: `flex`,
        width: `100%`,
        height: `auto`,
        alignItems: `center`,
        justifyContent:  `center`,
    },
    liveButton:{
        fontWeight: `bold`,
        padding: `2.2em`,
    },
    liveButtonInContainer: {
        fontSize: ({ smallTextInHorizontal }) => smallTextInHorizontal ? `1.4em` : `1.8em`,
        color: THEME_COLOR_CLASS_TYPE_LIVE,
        background: theme.palette.common.white,
        "&:hover": {
            backgroundColor: darken(theme.palette.common.white, 0.1),
        },
    },
    liveButtonImageOverlay: {
        position: `absolute`,
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        fontSize: `1.25em`,
        padding: `2.8em`,
        background: THEME_COLOR_CLASS_TYPE_LIVE,
        color: theme.palette.common.white,
        "&:hover": {
            backgroundColor: darken(THEME_COLOR_CLASS_TYPE_LIVE, 0.1),
        },
    },
    liveButtonLabel: {
        fontSize: `0.8em`,
        lineHeight: `1.1em`,
        wordBreak: `keep-all`,
    },
})));

interface Props extends ReactResizeDetectorDimensions {
}

function StudentNextClass (props: Props) {
    const { width } = props;
    const isVerticalMode =  width ? width < VERTICAL_MODE_BREAKPOINT : false;
    const smallTextInHorizontal = width ? !isVerticalMode && width < LARGE_TEXT_BREAKPOINT : false;

    const intl = useIntl();
    const classes = useStyles({
        isVerticalMode,
        smallTextInHorizontal,
    });

    const mockTeacherData = [
        {
            givenName: intl.formatMessage({
                id:`studentHome.nextClass.teacher1.givenName`,
            }),
            surname: intl.formatMessage({
                id:`studentHome.nextClass.teacher1.surname`,
            }),
            img: null,
        },
        {
            givenName: intl.formatMessage({
                id:`studentHome.nextClass.teacher2.givenName`,
            }),
            surname: intl.formatMessage({
                id:`studentHome.nextClass.teacher2.surname`,
            }),
            img: christina,
        },
    ];

    const mockClassDetailsData = {
        title: intl.formatMessage({
            id: `studentHome.mockData.lesson1.title`,
        }),
        startTime: startOfHour,
        duration: 120,
    };

    return (
        <Box className={ classes.root }>
            <Grid
                container
                alignItems="stretch"
            >
                <Grid
                    item
                    xs={ isVerticalMode ? 12 : 3}
                    className={ classes.imageContainer }
                >
                    <img
                        className={ classes.image }
                        src={NextClassThumb} />
                    {
                        isVerticalMode &&
                        <Fab
                            color="primary"
                            className={clsx(classes.liveButton, classes.liveButtonImageOverlay)}
                            onClick={() => { console.log(`live`); }}
                        >
                            <span className={classes.liveButtonLabel}><FormattedMessage id="home.nextClass.goLive" /></span>
                        </Fab>
                    }
                </Grid>

                <Grid
                    item
                    xs
                    className={ classes.contentContainer }
                >
                    <div className={ classes.content }>
                        <div>
                            <Chip
                                className={classes.darkChip}
                                label={ intl.formatMessage({
                                    id:`nextClass_title`,
                                })} />
                            <Box
                                display="flex"
                                alignItems="center"
                                p={1}>
                                <Box
                                    paddingTop={.25}
                                    paddingRight={1}>
                                    <LiveTvIcon fontSize={smallTextInHorizontal ? `medium` : `large`} />
                                </Box>
                                <Typography
                                    variant={ smallTextInHorizontal ? `h6`: `h5` }
                                    className={ classes.title }>
                                    { mockClassDetailsData.title }
                                </Typography>
                            </Box>
                        </div>
                        <Divider className={classes.divider} />
                        <Box>
                            <Box
                                className={ classes.classDetails }>
                                <div className={ classes.teacherList }>
                                    <Chip
                                        className={classes.darkChip}
                                        label={
                                            intl.formatMessage({
                                                id: `home.nextClass.teachersTitle`,
                                            }, {
                                                count: 2,
                                            })
                                        }
                                    />
                                    <Box paddingTop={1}>
                                        <Grid
                                            container>
                                            { mockTeacherData.map((teacher, i) => (
                                                <Grid
                                                    key={`teacher-${i}`}
                                                    item
                                                    className={classes.teacher}>
                                                    <Box
                                                        display="flex"
                                                        flexDirection="row"
                                                        alignItems="center"
                                                        className="singleTeacher"
                                                    >
                                                        <UserAvatar
                                                            name={`${ teacher.givenName } ${ teacher.surname }`}
                                                            className={classes.avatar}
                                                            size={smallTextInHorizontal ? `small` : `medium`}
                                                        />
                                                        <Typography variant={ smallTextInHorizontal ? `body2` : `body1`}>{ teacher.givenName }</Typography>
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
                                        variant={ smallTextInHorizontal ? `body2` : `body1`}>
                                        <FormattedDate
                                            value={mockClassDetailsData.startTime}
                                            day="2-digit"
                                            month="long"
                                            weekday="long"
                                        />
                                    </Typography>
                                    <Typography
                                        noWrap
                                        variant={ smallTextInHorizontal ? `body2` : `body1`}>
                                        <FormattedDate
                                            value={mockClassDetailsData.startTime}
                                            hour12={true}
                                            hour="2-digit"
                                            minute="2-digit"
                                        />
                                        <FormattedDuration
                                            seconds={ mockClassDetailsData.duration * 60 }
                                            format=" - {hours} {minutes}"
                                        />
                                    </Typography>
                                </div>
                            </Box>
                        </Box>
                    </div>
                </Grid>
                { !isVerticalMode &&
                    <Grid
                        item
                        xs={2}
                        className={ classes.liveButtonContainer }>
                        <Fab
                            color="primary"
                            className={clsx(classes.liveButton, classes.liveButtonInContainer)}
                            onClick={() => { console.log(`live`); }}
                        >
                            <span className={classes.liveButtonLabel}>
                                <FormattedMessage id="home.nextClass.goLive" />
                            </span>
                        </Fab>
                    </Grid>
                }
            </Grid>
        </Box>
    );
}

export default withResizeDetector(StudentNextClass);
