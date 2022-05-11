import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabUnstyled,
{ tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { Box, Checkbox, FormControl, MenuItem, Select, Typography } from "@mui/material";
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';
import OverallPerformanceChart from "./Charts/OverallPerfromanceChart";
import { getOverallPerformanceData, skillPerformanceData, getSkillSlides } from "./utilities";
//TODO : These will be enabled once the skill based chart Api  is ready
// import SkillPerformance from "./Charts/SkillPerformance";
// import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
// import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {
    createTheme,
    Theme,
} from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import { styled } from '@mui/system';
import React, { useEffect, useMemo, useState } from "react";
import { ParentSize } from '@visx/responsive';
import OverallPerformanceLegend from './Charts/Legends/OverallPerformanceLegend';
import SkillPerformanceLegend from './Charts/Legends/SkillPerformanceLegend';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSPRReportAPI } from '@/api/sprreportapi';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: `551px`,
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: theme.spacing(1.5),
            position: `relative`
        },
        graphSwitch: {
            width: `100%`,
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
            padding: theme.spacing(1.5),
            display: `flex`,
            justifyContent: `center`,
            position: `relative`,
        },
        selectInput: {
            position: `absolute`,
            right: theme.spacing(2),
        },
        selectMenu: {
            marginTop: theme.spacing(1),
            padding: theme.spacing(0),
            borderRadius: theme.spacing(1),
            boxShadow: `none`,
            border: `1px solid ${theme.palette.info.main}`,
        },
        selectMenuList: {
            padding: theme.spacing(0),
        },
        viewScores: {
            paddingTop: theme.spacing(1),
            paddingRight: theme.spacing(5),
            display: `flex`,
            alignItems: `center`,
            justifyContent: `end`
        },
        viewScoresIcon: {
            fontSize: theme.typography.pxToRem(20),
        },
        tooltipContainer: {
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `center`,
            position: `relative`
        },
        tooltipArrow: {
            position: `absolute`,
            bottom: -22,
            fontSize: theme.typography.pxToRem(40),
        },
        skillArrowIcons: {
            position: `absolute`,
            top: `45%`,
            color: theme.palette.grey[300],
            fontSize: theme.typography.pxToRem(30),
            cursor: `pointer`
        }
    }));

interface StyledTabProps {
    performanceRates?: boolean;
}

//TODO: update the css once the skill based graph is enabled
const Tab = styled(TabUnstyled, {
    shouldForwardProp: (prop) => prop !== `performanceRates`,
})<StyledTabProps>(({ performanceRates, theme }) => ({
    width: 150,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(16),
    padding: theme.spacing(1),
    color: theme.palette.info.main,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.info.main}`,
    borderRadius: performanceRates ? theme.spacing(3) : `0px ${theme.spacing(2)} ${theme.spacing(2)} 0px`,
    [`&.${tabUnstyledClasses.selected}`]: {
        border: `none`,
        color: theme.palette.common.black,
    },
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
    width: 100,
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.common.black,
    textAlign: `center`,
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.spacing(3),
    cursor: `pointer`,
    [`&.${inputBaseClasses.focused}`]: {
        border: `1px solid ${theme.palette.info.main}`,
    }
}));

interface SkillSlides {
    performanceScores: {
        name: string;
        achieved: number;
        notAchieved: number;
    };
    learningOutcomeScores: {
        name: string;
        achieved: number;
        notAchieved: number;
    };
}

interface OverallPerformanceData {
    date: string,
    above?: number,
    meets?: number,
    below?: number,
    score: {
        above?: number,
        meets?: number,
        below?: number,
    },
}

interface StudentProps {
    student_id: string;
    student_name: string;
    avatar: string;
}

interface Props {
    width: number;
    height: number;
    selectedNodeId: string;
    class_id: string;
    selectedStudent: StudentProps | undefined;
}

const timeZoneOffset = new Date()
    .getTimezoneOffset() / -60;

export default function PerformanceRates(props: Props) {
    const { selectedNodeId, width, height, class_id, selectedStudent } = props;
    const classes = useStyles();
    const theme = createTheme();
    const intl = useIntl();
    const [viewScores, setViewScores] = useState(false);
    const [page, setPage] = useState(0);
    const [skillSlides, setSkillSlides] = useState<SkillSlides[][]>([]);
    const [skillData, setSkillData] = useState<SkillSlides[]>([]);
    const [skillCategories, setSkillCategories] = useState<string[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const filterItems = [
        {
            label: intl.formatMessage({
                id: `student.report.performanceRates.filterWeek`,
                defaultMessage: `Week`
            }),
            value: 7
        },
        {
            label: intl.formatMessage({
                id: `student.report.performanceRates.filterMonth`,
                defaultMessage: `Month`
            }),
            value: 30
        }
        ,
        {
            label: intl.formatMessage({
                id: `student.report.performanceRates.filterYear`,
                defaultMessage: `Year`
            }),
            value: 365
        }
    ];
    const [timeRange, setTimeRange] = useState<any>(filterItems[0]);
    const overallPerformanceData = getOverallPerformanceData(selectedNodeId, timeRange.label);
    // const [ overallPerformanceData, setOverallPerformanceData ] = useState<OverallPerformanceData>([]);
    const [error, setError] = useState(false);
    const keys = ["above", "meets", "below", "all"];
    const sprApi = useSPRReportAPI();
    useEffect(() => {
        sprApi.getPerformances({
            classId: class_id,
            days: timeRange.value,
            viewLOs: true,
            timezone: timeZoneOffset, // No Required
            [keys.indexOf(selectedNodeId) < 0 ? `studentId` : `group`]: selectedNodeId,
        }).then(data => {
            console.log(JSON.stringify(data));
            setError(false);
        })
            .catch(_ => {
                setError(true);
            });
    }, [class_id, selectedNodeId, timeRange]);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeRange = filterItems.find(item => item.label === event.target.value);
        setTimeRange(timeRange);

    };
    const handleViewScores = (event: React.ChangeEvent<HTMLInputElement>) => {
        setViewScores(event.target.checked);
    }
    //TODO: Add these function once we enable the Skill based graph
    // const handleNext = () => {
    //     setPage(page + 1);
    // }
    // const handlePrevious = () => {
    //     setPage(page - 1);
    // }
    const updateSkillCategories = (category: string) => {
        setSkillCategories(prevValue => [...prevValue, category]);
    }
    useEffect(() => {
        const skillSlides = skillPerformanceData[0].data.map(data => getSkillSlides(data, updateSkillCategories)).reduce((final, current) => final.concat(current), []);
        setSkillSlides(skillSlides);
    }, [skillPerformanceData]);

    useEffect(() => {
        setSkillData(skillSlides[page]);
    }, [page, skillSlides]);

    return (
        <Box>
            <Typography color={theme.palette.grey[600]} paddingBottom={theme.spacing(0.5)} fontWeight={600} fontSize="0.8rem">
                <FormattedMessage id="student.report.performanceRates.performanceRatesTitle" defaultMessage="Performance Rates" />
            </Typography>
            <Box className={classes.root}>
                <TabsUnstyled defaultValue={0}>
                    <Box className={classes.graphSwitch}>
                        <FormControl className={classes.selectInput}>
                            <Select
                                displayEmpty
                                value={timeRange.label}
                                inputProps={{
                                    'aria-label': `Without label`,
                                }}
                                onChange={handleChange}
                                input={<StyledInput />}
                                MenuProps={{
                                    classes: {
                                        paper: classes.selectMenu,
                                        list: classes.selectMenuList
                                    }
                                }}
                            >
                                {filterItems.map(item => (
                                    <MenuItem key={item.label} value={item.label}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TabsListUnstyled onClick={() => setViewScores(false)}>
                            <Tab performanceRates onClick={() => setTabIndex(0)}>
                                <FormattedMessage id="student.report.performanceRates.tab1" defaultMessage="Overall" />
                            </Tab>
                            {/* //TODO : Enable the skill based chart once the API is ready */}
                            {/* <Tab onClick={() => setTabIndex(1)}>
                                <FormattedMessage id="student.report.performanceRates.tab2" defaultMessage="Skill based" />
                            </Tab> */}
                        </TabsListUnstyled>
                    </Box>
                    <Box className={classes.viewScores}>
                        {
                            !!tabIndex &&
                            <Box width="100%" left={0} position="absolute" display="flex" justifyContent="center">
                                <Typography fontSize={14} color={`#9473E5`}>{skillCategories[page]}</Typography>
                            </Box>
                        }
                        <Checkbox
                            onChange={handleViewScores}
                            checked={viewScores}
                            icon={<RadioButtonUncheckedOutlinedIcon className={classes.viewScoresIcon} color="disabled" />}
                            checkedIcon={<RadioButtonCheckedOutlinedIcon className={classes.viewScoresIcon} color="info" />}
                        />
                        <Typography fontSize={14}>
                            <FormattedMessage id="student.report.performanceRates.viewLOs" defaultMessage="View LOs" />
                        </Typography>
                    </Box>
                    <TabPanelUnstyled value={0}>
                        <>
                            <OverallPerformanceChart
                                data={overallPerformanceData}
                                timeRange={timeRange.label}
                                filterItems={filterItems}
                                viewScores={viewScores}
                                width={width}
                                height={height}
                                selectedNodeId={selectedNodeId}
                                selectedStudent={selectedStudent}
                            />
                            <OverallPerformanceLegend />
                        </>
                    </TabPanelUnstyled>
                    {/* //TODO : Enable the skill based chart once the API is ready */}
                    {/* <TabPanelUnstyled value={1}>
                        <ParentSize>
                            {({ width, height }) => (
                                <>
                                    <SkillPerformance data={skillData} width={width} height={height} viewScores={viewScores} />
                                    <Box style={{ height: 40, width: width, textAlign: 'center' }}>
                                        <Typography color={theme.palette.grey[600]}>{page + 1}/{skillSlides.length}</Typography>
                                    </Box>
                                    <ArrowForwardIosRoundedIcon onClick={handleNext} className={classes.skillArrowIcons} style={{ right: 10, display: (page + 1) === skillSlides.length ? `none` : `initial` }} />
                                    <ArrowBackIosRoundedIcon onClick={handlePrevious} className={classes.skillArrowIcons} style={{ left: 10, display: page === 0 ? `none` : `initial` }} />
                                    <Box display="flex" paddingLeft={theme.spacing(5)}>
                                        <SkillPerformanceLegend height={height} />
                                    </Box>
                                </>
                            )}
                        </ParentSize>
                    </TabPanelUnstyled> */}
                </TabsUnstyled>
            </Box>
        </Box>
    );
}
