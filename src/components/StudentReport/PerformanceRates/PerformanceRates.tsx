import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabUnstyled,
{ tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { Box, Checkbox, CircularProgress, FormControl, MenuItem, Select, Typography } from "@mui/material";
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';
import OverallPerformanceChart from "./Charts/OverallPerfromanceChart";
import { GroupNameAll, mapSkillGraph, OverallPerformanceData } from "./DataFormatter";
import SkillPerformance from "./Charts/SkillPerformance";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
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
import { useSPRReportAPI } from '@/api/sprReportApi';
import { mapPerfomanceGraph } from './DataFormatter';
import WidgetWrapperError from '@/components/Dashboard/WidgetManagement/WidgetWrapperError';
import WidgetWrapperNoData from '@/components/Dashboard/WidgetManagement/WidgetWrapperNoData';

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
        },
        pageLoading: {
            display: `flex`,
            margin: `auto`,
            height: `100% !important`,
        },
        tab: {
            height: '80%',
        }
    }));

interface StyledTabProps {
    performanceRates?: boolean;
    theme: Theme
}

const Tab = styled(TabUnstyled, {
    shouldForwardProp: (prop) => prop !== `performanceRates`,
})<StyledTabProps>(({ performanceRates, theme }: StyledTabProps) => ({
    width: 150,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(14),
    padding: theme.spacing(1),
    color: theme.palette.info.main,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.info.light}`,
    borderRadius: performanceRates ? `${theme.spacing(2)} 0px 0px ${theme.spacing(2)}` : `0px ${theme.spacing(2)} ${theme.spacing(2)} 0px`,
    [`&.${tabUnstyledClasses.selected}`]: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.info.light,
    },
}));

const StyledInput = styled(InputBase)(({ theme }: { theme: Theme }) => ({
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
interface StudentProps {
    student_id: string;
    student_name: string;
    avatar: string;
}

interface Props {
    width: number;
    height: number;
    selectedNodeId: string | undefined;
    class_id: string;
    selectedStudent: StudentProps | undefined;
    selectedGroup: GroupNameAll;
}

const timeZoneOffset = new Date()
    .getTimezoneOffset() / -60;

export default function PerformanceRates(props: Props) {
    const { selectedNodeId, width, height, class_id, selectedStudent, selectedGroup } = props;
    const classes = useStyles();
    const theme = createTheme();
    const intl = useIntl();
    const [viewScores, setViewScores] = useState(false);
    const [page, setPage] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);
    const filterItems = [
        {
            label: intl.formatMessage({
                id: `student.report.performanceRates.filterWeek`,
            }),
            value: 7
        },
        {
            label: intl.formatMessage({
                id: `student.report.performanceRates.filterMonth`,
            }),
            value: 30
        }
        ,
        {
            label: intl.formatMessage({
                id: `student.report.performanceRates.filterYear`,
            }),
            value: 365
        }
    ];
    const [timeRange, setTimeRange] = useState<any>(filterItems[0]);
    const [overallPerformanceData, setOverallPerformanceData] = useState<OverallPerformanceData[]>([]);
    const [skillPerformanceData, setSkillPerformanceData] = useState<any[]>([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const sprApi = useSPRReportAPI();
    useEffect(() => {
        let didUnmount = false;
        setLoading(true);
        setError(false);
        performmanceApiCall(tabIndex, props)
            .then((data: any) => {
                const formattedData = tabIndex === 0 ?
                    mapPerfomanceGraph(data || [], selectedGroup)
                    : mapSkillGraph(data);
                if (!didUnmount) {
                    tabIndex === 0 ? setOverallPerformanceData(formattedData)
                        : setSkillPerformanceData(formattedData);
                }
            })
            .catch(() => {
                tabIndex === 0 ? setOverallPerformanceData([])
                    : setSkillPerformanceData([]);
                setError(true);
            })
            .finally(() => !didUnmount && setLoading(false));
        return () => { didUnmount = true };
    }, [class_id, selectedNodeId, timeRange, selectedGroup, tabIndex]);

    const performmanceApiCall = (tabIndex: number, props: Props) => {
        const { selectedNodeId, class_id, selectedGroup } = props;
        setPage(0);
        const req = {
            classId: class_id,
            days: timeRange.value,
            viewLOs: true,
            timezone: timeZoneOffset, // No Required
            ...(selectedNodeId && { studentId: selectedNodeId }),
            ...(!selectedNodeId && { group: selectedGroup })
        };
        if (tabIndex === 0) {
            return sprApi.getPerformances({
                ...req
            });
        } else {
            return sprApi.getPerformanceSkills({
                ...req
            });
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeRange = filterItems.find(item => item.label === event.target.value);
        setTimeRange(timeRange);

    };
    const handleViewScores = (event: React.ChangeEvent<HTMLInputElement>) => {
        setViewScores(event.target.checked);
    }
    const handleNext = () => {
        setPage(page + 1);
    }
    const handlePrevious = () => {
        setPage(page - 1);
    }

    return (
        <Box>
            <Typography color={theme.palette.grey[600]} paddingBottom={theme.spacing(0.5)} fontWeight={600} fontSize="0.8rem">
                <FormattedMessage id="student.report.performanceRates.performanceRatesTitle" defaultMessage="Performance Rates" />
            </Typography>
            <Box className={classes.root}>
                <TabsUnstyled defaultValue={0} className={classes.tab}>
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
                            <Tab performanceRates onClick={() => setTabIndex(0)} theme={theme}>
                                <FormattedMessage id="student.report.performanceRates.tab1" defaultMessage="Overall" />
                            </Tab>
                            <Tab onClick={() => setTabIndex(1)} theme={theme}>
                                <FormattedMessage id="student.report.performanceRates.tab2" defaultMessage="Skill based" />
                            </Tab>
                        </TabsListUnstyled>
                    </Box>
                    <Box className={classes.viewScores}>
                        {
                            !!tabIndex &&
                            <Box width="100%" left={0} position="absolute" display="flex" justifyContent="center">
                                <Typography fontSize={14} color={`#9473E5`}>{skillPerformanceData[page]?.category}</Typography>
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
                    {loading ? <CircularProgress
                        color="primary"
                        className={classes.pageLoading}
                    /> :
                        error ? <WidgetWrapperError /> :
                            <>
                                <TabPanelUnstyled value={0}>
                                    {!overallPerformanceData.length ?
                                        <WidgetWrapperNoData /> :
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
                                                selectedGroup={selectedGroup} />
                                            <OverallPerformanceLegend />
                                        </>}
                                </TabPanelUnstyled>
                                <Box paddingTop={theme.spacing(3)}>
                                    <TabPanelUnstyled value={1}>
                                        {!skillPerformanceData.length ?
                                            <WidgetWrapperNoData /> :
                                            <ParentSize>
                                                {({ width, height }) => (
                                                    <>
                                                        <SkillPerformance
                                                            data={skillPerformanceData[page].data}
                                                            width={width}
                                                            height={height}
                                                            timeRange={timeRange.label}
                                                            filterItems={filterItems}
                                                            viewScores={viewScores}
                                                            selectedNodeId={selectedNodeId}
                                                            selectedStudent={selectedStudent}
                                                            selectedGroup={selectedGroup} />
                                                        <Box style={{ height: 40, width: width, textAlign: 'center' }}>
                                                            <Typography color={theme.palette.grey[600]}>{page + 1}/{skillPerformanceData.length}</Typography>
                                                        </Box>
                                                        <ArrowForwardIosRoundedIcon onClick={handleNext} className={classes.skillArrowIcons} style={{ right: 10, display: (page + 1) === skillPerformanceData.length ? `none` : `initial` }} />
                                                        <ArrowBackIosRoundedIcon onClick={handlePrevious} className={classes.skillArrowIcons} style={{ left: 10, display: page === 0 ? `none` : `initial` }} />
                                                        <Box display="flex" paddingLeft={theme.spacing(5)}>
                                                            <SkillPerformanceLegend height={height} />
                                                        </Box>
                                                    </>
                                                )}
                                            </ParentSize>}
                                    </TabPanelUnstyled>
                                </Box>
                            </>}
                </TabsUnstyled>
            </Box>
        </Box>
    );
}
