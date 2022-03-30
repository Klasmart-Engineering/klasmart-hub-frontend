import LevelBox from "./LevelBox";
import LinePath from "./LinePath/LinePath";
import Popup from "./Popup";
import ProgressBar from "./ProgressBar";
import mockData from "./utilities";
import desktop from "@/assets/img/AdaptiveLearningJourney/desktop.png";
import mobileBg from "@/assets/img/AdaptiveLearningJourney/mobileBg.png";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Box } from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React,
{
    createRef,
    useEffect,
    useRef,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useResizeDetector } from "react-resize-detector";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root : {
            height: `570px`,
            width: `100%`,
            position: `relative`,
            overflow : `hidden`,
            borderRadius: theme.spacing(1.2),
            [theme.breakpoints.down(`sm`)]: {
                height : `500px`,
            },
        },
        slider: {
            height: `100%`,
            width: `100%`,
            padding: `${theme.spacing(0)} ${theme.spacing(10)}`,
            display: `flex`,
            alignItems: `end`,
            overflow: `hidden`,
            position: `relative`,
            scrollBehavior: `smooth`,
            [theme.breakpoints.down(`sm`)]: {
                padding: `${theme.spacing(10)} ${theme.spacing(2)}`,
                flexDirection: `column`,
                alignItems: `start`,
            },
        },
        bgWrapper : {
            position : `absolute`,
            display: `flex`,
            overflow: `hidden`,
            scrollBehavior: `smooth`,
            width : `100%`,
            height : `100%`,
            [theme.breakpoints.down(`sm`)]: {
                flexDirection: `column`,
            },
        },
        levelContainer : {
            minWidth : 250,
            minHeight : 200,
            marginBottom : theme.spacing(10),
            display: `flex`,
            position: `relative`,
            [theme.breakpoints.up(`sm`)]: {
                justifyContent: `space-between`,
            },
            [theme.breakpoints.down(`sm`)]: {
                flexDirection: `column`,
                justifyContent: `start`,
                marginBottom : theme.spacing(0),
                minWidth : 100,
                minHeight : 150,
            },
        },
        leftNavigator: {
            fontWeight: 600,
            color: theme.palette.common.white,
            fontSize: 50,
            position: `absolute`,
            left: 0,
            zIndex: 2,
            cursor: `pointer`,
            [theme.breakpoints.up(`sm`)]: {
                height: `100%`,
            },
            [theme.breakpoints.down(`sm`)]: {
                width: `100%`,
                top: 0,
                transform: `rotate(90deg)`,
            },
        },
        rightNavigator: {
            fontWeight: 600,
            color: theme.palette.common.white,
            fontSize: 50,
            position: `absolute`,
            right:0,
            zIndex: 2,
            cursor: `pointer`,
            [theme.breakpoints.up(`sm`)]: {
                height: `100%`,
            },
            [theme.breakpoints.down(`sm`)]: {
                width: `100%`,
                bottom: 0,
                transform: `rotate(90deg)`,
            },
        },
    }));

const VERTICAL_MODE_BREAKPOINT = 520;
interface DataObj {
    level: number;
    ratings: number;
    completed: boolean;
    type: string;
    category: string;
    hasBooster: boolean;
    boosterRatings: number;
    boosterCompleted: boolean;
    boosterCategory: string;
    slides: number;
}

interface Props {}

function AdaptiveLearningJourney (props : Props) {
    const {
        width,
        height,
        ref,
    } = useResizeDetector();
    const sliderRef = useRef(createRef()) as any;
    const bgRef = useRef(createRef()) as any;
    const levelsRef = useRef(mockData.map(() => createRef())) as any;
    const classes = useStyles();
    const intl = useIntl();
    const scrollOffset = 500;
    const [ currentLevel, setCurrentLevel ] = useState({} as DataObj);
    const [ selectedAssesmentType, setSelectedAssesmentType ] = useState(`live`);
    const [ selectedAssesment, setSelectedAssesment ] = useState({} as DataObj | null);
    const [ connectorSVGWidth, setConnectorSVGWidth ] = useState(0);
    const [ connectorSVGHeight, setConnectorSVGHeight ] = useState(0);
    const [ isVerticalMode, setIsverticalMode ] = useState(width ? width < VERTICAL_MODE_BREAKPOINT : false);
    const [ open, setOpen ] = useState(false);

    const scroll = (scrollOffset: number) => {
        if(isVerticalMode){
            sliderRef.current.scrollTop += scrollOffset;
            bgRef.current.scrollTop = (sliderRef.current.scrollTop + scrollOffset);
        } else {
            sliderRef.current.scrollLeft += scrollOffset;
            bgRef.current.scrollLeft = (sliderRef.current.scrollLeft + scrollOffset);
        }

    };
    const handlePopup = (open : boolean, type : string, data : DataObj | null) => {
        setOpen(open);
        setSelectedAssesmentType(type);
        setSelectedAssesment(data);
    };

    useEffect(() => {
        setCurrentLevel(mockData.filter(data => !data.completed || (data.hasBooster && !data.boosterCompleted))[0]);
    }, [ mockData ]);

    useEffect(() => {
        setIsverticalMode(width ? width < VERTICAL_MODE_BREAKPOINT : false);
    }, [ width ]);

    useEffect(() => {
        sliderRef.current.scrollTop = 0;
        sliderRef.current.scrollLeft = 0;
        bgRef.current.scrollTop = 0;
        bgRef.current.scrollLeft = 0;
        const slider = sliderRef.current?.getBoundingClientRect();
        const lastLevelPosition = levelsRef.current[mockData.length - 1].current.getBoundingClientRect();
        setConnectorSVGWidth(lastLevelPosition?.left - slider?.left);
        setConnectorSVGHeight(lastLevelPosition?.top - slider?.top);
    }, [
        currentLevel,
        width,
        height,
        isVerticalMode,
        setConnectorSVGWidth,
        setConnectorSVGHeight,
    ]);

    return (
        <WidgetWrapper
            noBackground
            loading={false}
            error={false}
            noData={false}
            reload={() => {false;}}
            label={
                intl.formatMessage({
                    id: `home.student.adaptiveLearningJourney.containerTitleLabel`,
                })
            }
            link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.adaptiveLearningWidget.containerUrlLabel`,
                }),
            }}
            id={WidgetType.ADAPTIVELEARNINGJOURNEY}>
            <Box
                ref={ref}
                className={classes.root}
                id={`adaptiveLearningJourney`}
            >
                <ArrowBackIosNewRoundedIcon
                    className={classes.leftNavigator}
                    onClick={() => scroll(isVerticalMode ? -(scrollOffset - 200) : -scrollOffset)}/>
                <ArrowForwardIosRoundedIcon
                    className={classes.rightNavigator}
                    onClick={() => scroll(isVerticalMode ? scrollOffset - 200 : scrollOffset)}/>
                <ProgressBar />
                <Popup
                    open={open}
                    handlePopup={handlePopup}
                    isVerticalMode={isVerticalMode}
                    selectedAssesment={selectedAssesment}
                    selectedAssesmentType={selectedAssesmentType}/>
                <Box
                    ref={bgRef}
                    className={classes.bgWrapper}>
                    <img
                        src={isVerticalMode ? mobileBg : desktop}
                        style={{
                            flexGrow : 1,
                        }}
                    />
                </Box>
                <Box
                    ref={sliderRef}
                    className={classes.slider}
                    id="slider">
                    <LinePath
                        levelsRef={levelsRef.current}
                        width={width ?? 0}
                        connectorSVGHeight={connectorSVGHeight}
                        connectorSVGWidth={connectorSVGWidth}
                        mockData={mockData}
                        isVerticalMode={isVerticalMode}
                    />
                    {mockData.map((data, i) => (
                        <Box
                            key={data.level}
                            className={classes.levelContainer}
                            sx={{
                                alignItems : data.level % 2 === 0 ? `start` : `center`,
                            }}>
                            {data.type !== `booster` &&
                        <LevelBox
                            ref={levelsRef.current[i]}
                            data={data}
                            booster={false}
                            currentLevel={currentLevel}
                            handlePopup={handlePopup}/>}

                            {data.hasBooster &&
                        <LevelBox
                            data={data}
                            booster={data.hasBooster}
                            currentLevel={currentLevel}
                            handlePopup={handlePopup}/>
                            }
                        </Box>
                    ))}
                </Box>
            </Box>
        </WidgetWrapper>
    );
}

export default AdaptiveLearningJourney;
