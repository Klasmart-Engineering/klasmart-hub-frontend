import { Star } from "./utilities";
import arrowDown from "@/assets/img/AdaptiveLearningJourney/arrowDown.png";
import checkMark from "@/assets/img/AdaptiveLearningJourney/checkMark.png";
import { retrieveClassTypeIdentityOrDefault } from "@/config/classTypes";
import { ScheduleClassType } from '@kidsloop/cms-api-client';
import {
    Badge,
    Box,
    SvgIcon,
    SvgIconTypeMap,
} from '@mui/material';
import { OverridableComponent } from "@mui/material/OverridableComponent";
import {
    createTheme,
    Theme,
} from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React,
{
    forwardRef,
    ReactElement,
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        levelWrapper : {
            width: 100,
            height : 120,
            position: `relative`,
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            cursor : `pointer`,
            borderBottom : `5px solid ${theme.palette.warning.main}`,
            backgroundColor: theme.palette.warning.light,
            borderRadius: theme.spacing(2.5),
            padding : theme.spacing(1.2),
            paddingTop: theme.spacing(0),
            [theme.breakpoints.down(`sm`)]: {
                width : 70,
                height : 80,
                padding : theme.spacing(1),
                paddingTop : theme.spacing(0),
            },
        },
        boosterWidget: {
            width: 100,
            height : 100,
            position: `absolute`,
            top: -170,
            left: 120,
            cursor : `pointer`,
            [theme.breakpoints.down(`sm`)]: {
                width : 60,
                height : 60,
                top: 70,
                borderRadius: theme.spacing(2.5),
                left: 150,
            },
            [theme.breakpoints.down(350)]: {
                left: 120,
            },
        },
        boosterWrapper: {
            width: 100,
            height : 100,
            borderRadius: theme.spacing(3.5),
            padding : theme.spacing(1.2),
            backgroundColor: `#FF5EE4`,
            position: `relative`,
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `space-around`,
            [theme.breakpoints.down(`sm`)]: {
                width : 70,
                height : 70,
                borderRadius: theme.spacing(2.5),
                padding : theme.spacing(1),
                paddingTop : theme.spacing(0),
            },
        },
        boosterCategory: {
            width: `80%`,
            height: `80%`,
            position: `relative`,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            [theme.breakpoints.down(`sm`)]: {
                width: `50%`,
                height: `50%`,
            },
        },
        assesment: {
            width: `100%`,
            height: `100%`,
            borderRadius: 10,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
        },
        boosterBadge: {
            position: `absolute`,
            left: 20,
            top: 0,
            padding: theme.spacing(1.5),
            borderRadius: `50%`,
            color: theme.palette.common.white,
            [theme.breakpoints.down(`sm`)]: {
                left: 13,
                padding: theme.spacing(1),
            },
        },
        ratings : {
            display: `flex`,
            justifyContent: `space-around`,
            padding: `${theme.spacing(.5)} ${theme.spacing(1.5)}`,
            [theme.breakpoints.down(`sm`)]: {
                padding: `${theme.spacing(.2)} ${theme.spacing(1)}`,
            },
        },
        type: {
            width: 40,
            height: 40,
            borderRadius : `50% 0 50% 0`,
            position: `absolute`,
            bottom: 0,
            right: 0,
            padding: theme.spacing(1),
            backgroundColor: theme.palette.warning.light,
            zIndex: 2,
            [theme.breakpoints.down(`sm`)]: {
                width : 30,
                height : 30,
                padding: theme.spacing(.5),
            },
        },
        checkMark: {
            width : 40,
            [theme.breakpoints.down(`sm`)]: {
                width : 21,
            },
        },
        classTypeIcon: {
            fontSize : `1.5rem`,
            color : theme.palette.common.white,
            [theme.breakpoints.down(`sm`)]: {
                fontSize : `1rem`,
            },
        },
        categoryIcon: {
            width: 70,
            [theme.breakpoints.down(`sm`)]: {
                width : 50,
            },
        },
        boosterCategoryIcon : {
            width: 60,
            [theme.breakpoints.down(`sm`)]: {
                width : 40,
            },
        },
        currentLevelIndicator: {
            position: `absolute`,
            top: -30,
            [theme.breakpoints.down(`sm`)]: {
                width : 20,
                top: -20,
            },
        },
    }));

    interface DataObj {
        level: number;
        ratings: number;
        completed: boolean;
        type: string;
        category: string;
        hasBooster: boolean;
        boosterRatings: number;
        boosterCompleted: boolean;
        slides: number;
        boosterCategory: string;
    }

    interface ClassTypeIdentity {
        intlKey: string | ReactElement;
        color: string;
        icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
        aliases?: (string|ScheduleClassType)[];
    }
    interface Props {
        data : DataObj;
        currentLevel: DataObj;
        booster : boolean;
        handlePopup: (open: boolean, type : string, data: DataObj) => void;
    }

function LevelBox (props : Props, ref : Ref<HTMLDivElement>) {

    const {
        data,
        currentLevel,
        handlePopup,
        booster,
    } = props;
    const classes = useStyles();
    const theme = createTheme();
    const [ classTypeIdentity, setClassTypeIdentity ] = useState<ClassTypeIdentity>();

    useEffect(() => {
        const classIdentity = retrieveClassTypeIdentityOrDefault(data?.type as ScheduleClassType);
        setClassTypeIdentity(classIdentity);
    }, [ data ]);

    return (
        <Box
            ref={ref}
            className={booster ? classes.boosterWidget : ``}
            onClick={() => handlePopup(true, (booster ? `booster` : data.type), data)}>
            <Box className={booster ? classes.boosterWrapper : classes.levelWrapper}>
                {currentLevel.level === data.level && (booster ? !data.boosterCompleted : !data.completed) &&
                            <img
                                src={arrowDown}
                                className={classes.currentLevelIndicator}/>
                }
                {booster &&
                data.slides > 0 &&
                <Badge
                    badgeContent={data.slides}
                    color="info"
                    overlap="circular"
                    classes={{
                        badge : classes.boosterBadge,
                    }} />
                }
                <Box className={classes.ratings}>
                    {[ ...Array(3) ].map((item, i) => (
                        <Star
                            key={i}
                            fill={(booster ? data.boosterRatings : data.ratings) > i ? `#FFF30B` : (booster ? `#EA34D5` : theme.palette.warning.main)} />
                    ))}
                </Box>
                <Box
                    sx={{
                        backgroundColor: !booster ? data.completed ? theme.palette.info.light : theme.palette.info.main : `inherit`,
                    }}
                    className={booster ? classes.boosterCategory : classes.assesment}>
                    {(booster ? data.boosterCompleted : data.completed) ? (
                        <img
                            className={classes.checkMark}
                            src={checkMark}/>

                    ) : (
                        <img
                            className={booster ? classes.boosterCategoryIcon : classes.categoryIcon}
                            src={booster ? data.boosterCategory : data.category}/>
                    )}
                </Box>
                {!booster &&
            <Box className={classes.type}>
                <SvgIcon
                    component={classTypeIdentity?.icon}
                    className={classes.classTypeIcon} />
            </Box>
                }
            </Box>
        </Box>
    );
}

export default forwardRef(LevelBox);
