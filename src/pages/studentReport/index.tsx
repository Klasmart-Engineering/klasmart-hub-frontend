import { Box, CircularProgress, Tab } from "@mui/material";
import React, { useState } from "react";
import {
  TabContext,
  TabList,
  TabPanel
} from "@mui/lab";
import Breadcrumb from "@/components/StudentReport/BreadCrumb";
import ClassTabs from "@/components/StudentReport/ClassTabs";
import { useIntl } from "react-intl";
import Performance from "@/components/StudentReport/PerformanceTab";
import { ClassDetail } from "@/api/sprReportApi";
import WidgetWrapperError from "@/components/Dashboard/WidgetManagement/WidgetWrapperError";
import {
  createStyles,
  makeStyles,
} from '@mui/styles';
import { tabTitle } from "@/utils/tabTitle";

const useStyles = makeStyles(() => createStyles({
  pageLoading: {
    display: `flex`,
    margin: `auto`,
    height: `60% !important`,
  },
}));
interface Performance {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}

interface Props { }

export default function StudentReport(props: Props) {
  const [tab, setTab] = useState(`performance`);
  const [classDetail, setClassDetail] = useState<ClassDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const intl = useIntl();
  const classes = useStyles();
  const performanceLabel = intl.formatMessage({
    id: `student.report.tabs.performance`,
  });
  const [error, setError] = useState<boolean>(false);
  const links = [
    {
      label: intl.formatMessage({
        id: `navMenu_studentReportTitle`,
      }),
      href: `#/student-report`,
    },
  ];

  const setClass = (classDetail: ClassDetail) => {
    setClassDetail(classDetail);
    setTab(`performance`);
  };

  tabTitle(`Student Report`);

  return (error ? <WidgetWrapperError /> :
    <Box padding={2} height={'100%'}>
      <Box paddingY={1}>
        <Breadcrumb links={links} />
      </Box>
      <ClassTabs onClassChange={setClass} setError={setError} setLoading={setLoading} />
        <TabContext value={tab}>
          {loading ? (<CircularProgress className={classes.pageLoading} />) : (
            <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={(_, tab) => setTab(tab)}>

                <Tab label={performanceLabel} value="performance" />
              </TabList>
            </Box>
            <TabPanel value="performance" sx={{ padding: 0 }}>
                {classDetail && <Performance {...classDetail} />}
            </TabPanel></>)}
        </TabContext>
    </Box>);
}
