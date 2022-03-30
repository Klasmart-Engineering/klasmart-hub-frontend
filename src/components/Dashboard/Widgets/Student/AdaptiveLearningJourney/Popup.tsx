
import assesment2 from "@/assets/img/AdaptiveLearningJourney/assesment2.png";
import assesment3 from "@/assets/img/AdaptiveLearningJourney/assesment3.png";
import assesment4 from "@/assets/img/AdaptiveLearningJourney/assesment4.png";
import chipIcon from "@/assets/img/AdaptiveLearningJourney/chipIcon.png";
import lock from "@/assets/img/AdaptiveLearningJourney/lock.png";
import christina from "@/assets/img/teacher_christina.png";
import ClassMockData from "@/components/Dashboard/Widgets/Student/Schedule/mockDataClasses";
import { retrieveClassTypeIdentityOrDefault } from "@/config/classTypes";
import { ScheduleClassType } from '@kidsloop/cms-api-client';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
    Box,
    Chip,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    SvgIcon,
    SvgIconTypeMap,
    Typography,
} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import MobileStepper from '@mui/material/MobileStepper';
import { OverridableComponent } from "@mui/material/OverridableComponent";
import {
    createTheme,
    Theme,
} from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import withStyles from '@mui/styles/withStyles';
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import React,
{
    ReactElement,
    useEffect,
    useState,
} from "react";
import {
    FormattedDate,
    FormattedMessage,
    useIntl,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";
import SwipeableViews from 'react-swipeable-views';

export interface StyleProps {
    selectedAssesmentType: string;
}

const useStyles = makeStyles<Theme, StyleProps>(((theme: Theme) =>
    createStyles({
        root : {
            position : `absolute`,
        },
        dialogBox : {
            maxWidth: 300,
            flexGrow: 1,
            overflow: `hidden`,
            borderRadius : theme.spacing(2),
            [theme.breakpoints.down(`sm`)] : {
                maxWidth : 240,
            },
        },
        popupCard : {
            background : theme.palette.common.white,
            minWidth: 240,
            maxWidth: 300,
            height : ({ selectedAssesmentType }) => selectedAssesmentType === `booster` ? 470 : 440,
            borderRadius: theme.spacing(2),
            alignSelf: `center`,
            overflow: `hidden`,
            [theme.breakpoints.down(`sm`)] : {
                height : ({ selectedAssesmentType }) => selectedAssesmentType === `booster` ? 400 : 390,
            },
        },
        assesmentIcon : {
            width : `100%`,
            height : `30%`,
            backgroundColor : `#FF9696`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            position : `relative`,
            [theme.breakpoints.down(`sm`)] : {
                height : ({ selectedAssesmentType }) => selectedAssesmentType === `booster` ? `25%` : `30%`,
            },
        },
        contentContainer : {
            width: `100%`,
            padding : `${theme.spacing(1.5)} ${theme.spacing(2.5)}`,
        },
        classChip : {
            height: theme.spacing(3),
            background : ({ selectedAssesmentType }) => selectedAssesmentType === `booster` ? `#FF5EE4` : theme.palette.info.main,
            color : theme.palette.common.white,
        },
        classChipIcon : {
            width : 15,
        },
        classTypeIcon : {
            fontSize : 15,
            fill: theme.palette.common.white,
        },
        text : {
            fontSize : `.8rem`,
            [theme.breakpoints.down(`sm`)] : {
                fontSize : `.7rem`,
            },
        },
        classTitle : {
            fontSize : `1.2rem`,
            lineHeight : 1.2,
        },
        row: {
            display: `grid`,
            gridTemplateColumns: `35% 45% 20% `,
            gridTemplateRows: `1fr`,
            alignItems: `center`,
            justifyContent: `space-around`,
            width: `100%`,
            padding : `${theme.spacing(.5)} ${theme.spacing(2.5)}`,
            [theme.breakpoints.down(`sm`)] : {
                padding : `${theme.spacing(.2)} ${theme.spacing(2.5)}`,
            },
        },
        progressGrid : {
            width : `100%`,
        },
        progressListItem : {
            padding : theme.spacing(0),
        },
        count: {
            fontSize: 14,
            fontWeight: 600,
            textAlign: `right`,
        },
        closeIcon : {
            cursor: `pointer`,
            position: `absolute`,
            top: 10,
            right : 10,
            color : theme.palette.common.white,
        },
        lockIconWrapper : {
            height : `100%`,
        },
        lockIcon : {
            position: `absolute`,
            bottom: 10,
            right : 10,
        },
        navigator : {
            position : `absolute`,
            bottom : `50%`,
            fontSize : 20,
            color : theme.palette.common.white,
            background : theme.palette.info.main,
            '&:hover': {
                background : theme.palette.info.main,
            },
        },
        stepperDot: {
            background: theme.palette.common.white,
        },
    })));

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
    handlePopup: (open : boolean, type : string, data : DataObj | null) => void;
    selectedAssesmentType : string;
    selectedAssesment : DataObj | null;
    isVerticalMode : boolean;
    open: boolean;
}

export default function Popup (props: Props) {

    const {
        handlePopup,
        open,
        selectedAssesmentType,
        selectedAssesment,
        isVerticalMode,
    } = props;
    const intl = useIntl();
    const classes = useStyles({
        selectedAssesmentType,
    });
    const theme = createTheme();
    const [ activeStep, setActiveStep ] = React.useState(0);
    const maxSteps = selectedAssesment?.slides ?? 1;
    const [ classTypeIdentity, setClassTypeIdentity ] = useState<ClassTypeIdentity>();

    const [ progressData, setProgressData ] = useState([
        {
            intlKey: <FormattedMessage id="home.student.adaptiveLearningWidget.badaBoost" />,
            score: 0,
            adaptiveLearning: 60,
        },
        {
            intlKey: <FormattedMessage id="home.student.adaptiveLearningWidget.skill3" />,
            score: 40,
            adaptiveLearning: 72,
        },
        {
            intlKey: <FormattedMessage id="home.student.adaptiveLearningWidget.skill2" />,
            score: 30,
            adaptiveLearning: 67,
        },
        {
            intlKey: <FormattedMessage id="home.student.adaptiveLearningWidget.skill1" />,
            score: 20,
            adaptiveLearning: 50,
        },
    ]);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleStepChange = (step : number) => {
        setActiveStep(step);
    };

    const handlePopupClose = () => {
        handlePopup(false, selectedAssesmentType, null);
        setActiveStep(0);
    };

    useEffect(() => {
        const classIdentity = retrieveClassTypeIdentityOrDefault(selectedAssesmentType as ScheduleClassType);
        setClassTypeIdentity(classIdentity);
    }, [ selectedAssesmentType ]);

    useEffect(() => {
        if(selectedAssesmentType !== `booster`){
            if(progressData.length > 3) setProgressData(progressData.splice(1, 3));
        } else {
            setProgressData([
                {
                    intlKey: <FormattedMessage id="home.student.adaptiveLearningWidget.badaBoost" />,
                    score: 0,
                    adaptiveLearning: 60,
                },
                ...progressData,
            ]);
        }
    }, [ selectedAssesmentType ]);

    const mockTeacherData = [
        {
            givenName: intl.formatMessage({
                id:`home.student.teacherFeedbackWidget.christina`,
            }),
            img: christina,
        },
        {
            givenName: intl.formatMessage({
                id:`studentHome.nextClass.teacher1.givenName`,
            }),
            img: null,
        },
    ];

    const mockAssesmentIcons = [
        selectedAssesment?.category,
        assesment2,
        assesment3,
        assesment4,
    ];

    const BorderLinearProgress = withStyles((theme: Theme) => ({
        root: {
            height: 10,
            borderRadius: theme.spacing(0.6),
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[200],
        },
        bar1Buffer : {
            backgroundColor: `#FFBC00`,
        },
        bar2Buffer : {
            borderRadius: theme.spacing(0.6),
            backgroundColor: `#FF5FE4`,
        },
        dashed : {
            display : `none`,
        },
    }))(LinearProgress);

    return (
        <Dialog
            PaperProps={{
                style : {
                    backgroundColor: `transparent`,
                    boxShadow: `none`,
                    overflow: `visible`,
                },
            }}
            open={open}
            BackdropProps={{
                style:{
                    position: `inherit`,
                },
            }}
            container={() => document.getElementById(`adaptiveLearningJourney`)}
            className={classes.root}
        >
            <Box
                className={classes.dialogBox}>
                <SwipeableViews
                    enableMouseEvents
                    axis={theme.direction === `rtl` ? `x-reverse` : `x`}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                >
                    {[ ...Array(maxSteps != 0 ? maxSteps : 1) ].map((slide, i) => (
                        <Box
                            key={i}
                            className={classes.popupCard}>
                            <Box className={classes.assesmentIcon}>
                                <CloseRoundedIcon
                                    className={classes.closeIcon}
                                    onClick={handlePopupClose}/>
                                {selectedAssesment ? !selectedAssesment?.completed && <Box className={classes.lockIconWrapper}><img
                                    className={classes.lockIcon}
                                    src={lock} /></Box> : <></>}
                                <img
                                    width={100}
                                    src={mockAssesmentIcons[i]}/>
                            </Box>
                            <Grid
                                container
                                alignItems="stretch"
                            >
                                <Grid
                                    item
                                    className={ classes.contentContainer }
                                >
                                    <div>
                                        <div>
                                            <Chip
                                                className={classes.classChip}
                                                icon={selectedAssesmentType === `booster` ? <img
                                                    className={classes.classChipIcon}
                                                    src={chipIcon}/> :
                                                    <SvgIcon
                                                        component={classTypeIdentity?.icon}
                                                        className={classes.classTypeIcon} />}
                                                label={ intl.formatMessage({
                                                    id: selectedAssesmentType === `booster` ? `home.student.adaptiveLearningJourney.classTitle` : `class.type.${selectedAssesmentType}`,
                                                })}
                                            />
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                paddingTop={1}>
                                                <Typography
                                                    variant={`h6`}
                                                    className={classes.classTitle}>
                                                    <FormattedMessage id={ClassMockData[i].titleKey}/>
                                                </Typography>
                                            </Box>
                                        </div>
                                        <Box>
                                            <Box>
                                                <div>
                                                    <Box paddingTop={1}>
                                                        <Grid
                                                            container>
                                                            { mockTeacherData.map((teacher, i) => (
                                                                <Grid
                                                                    key={`teacher-${i}`}
                                                                    item>
                                                                    <Box
                                                                        display="flex"
                                                                        flexDirection="row"
                                                                        alignItems="center"
                                                                        className="singleTeacher"
                                                                    >
                                                                        <UserAvatar
                                                                            name={teacher.givenName}
                                                                            src={teacher.img ?? undefined}
                                                                            size={`small`}
                                                                        />
                                                                        <Typography
                                                                            variant={ `body2`}
                                                                            className={classes.text}
                                                                            p={1}>{ teacher.givenName }</Typography>
                                                                    </Box>
                                                                </Grid>
                                                            ))
                                                            }
                                                        </Grid>
                                                    </Box>
                                                </div>
                                                <Divider />
                                                <Box pt={1}>
                                                    <Typography
                                                        noWrap
                                                        variant={`body2`}
                                                        className={classes.text}>
                                                        <FormattedDate
                                                            value={ClassMockData[i].startTime}
                                                            day="2-digit"
                                                            month="long"
                                                            weekday="long"
                                                        />
                                                    </Typography>
                                                    <Typography
                                                        noWrap
                                                        variant={`body2`}
                                                        className={classes.text}>
                                                        <FormattedDate
                                                            value={ClassMockData[i].startTime}
                                                            hour12={true}
                                                            hour="2-digit"
                                                            minute="2-digit"
                                                        />
                                                        <FormattedDuration
                                                            seconds={ ClassMockData[i].duration * 60 }
                                                            format=" - {hours} {minutes}"
                                                        />
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </div>
                                </Grid>
                                <Grid
                                    item
                                    className={classes.progressGrid}
                                >
                                    <List>
                                        {progressData?.map((item, index:number)=>{
                                            return <ListItem
                                                key={index}
                                                className={classes.progressListItem}>
                                                <div
                                                    className={classes.row}>
                                                    <Box>
                                                        <Typography className={classes.text}>{item.intlKey}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <BorderLinearProgress
                                                            variant="buffer"
                                                            value={selectedAssesment?.completed ? item.score : 0}
                                                            valueBuffer={selectedAssesmentType === `booster` ? item.adaptiveLearning : 0} />
                                                    </Box>
                                                    <Box
                                                        className={classes.count}
                                                        style={{
                                                            color : item.score > 0 ? `#FFBC00` : `#FF5FE4`,
                                                        }}>
                                                        {selectedAssesment?.completed ? `${selectedAssesmentType === `booster` ? item.adaptiveLearning : item.score}%` : `0%`}
                                                    </Box>
                                                </div>
                                            </ListItem>;
                                        })}
                                    </List>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </SwipeableViews>
                {selectedAssesmentType === `booster` && maxSteps > 1 &&
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    classes={{
                        dotActive : classes.stepperDot,
                    }}
                    sx={{
                        background : `none`,
                        padding : theme.spacing(2),
                        maxWidth : 300,
                        display : `flex`,
                        justifyContent : `center`,
                        alignItems : `center`,
                    }}
                    nextButton={
                        !isVerticalMode && <IconButton
                            size="medium"
                            disabled={activeStep === maxSteps - 1}
                            className={classes.navigator}
                            sx={{
                                right : -50,
                            }}
                            onClick={handleNext}
                        >
                            {theme.direction === `rtl` ? (
                                <KeyboardArrowLeft />
                            ) : (
                                <KeyboardArrowRight />
                            )}
                        </IconButton>
                    }
                    backButton={
                        !isVerticalMode && <IconButton
                            size="medium"
                            disabled={activeStep === 0}
                            className={classes.navigator}
                            sx={{
                                left : -50,
                            }}
                            onClick={handleBack}>
                            {theme.direction === `rtl` ? (
                                <KeyboardArrowRight />
                            ) : (
                                <KeyboardArrowLeft />
                            )}
                        </IconButton>
                    }
                />
                }
            </Box>
        </Dialog>
    );
}
