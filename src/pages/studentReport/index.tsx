import { Box, Tab } from "@mui/material";
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
import { ClassDetail } from "@/api/sprreportapi";
import WidgetWrapperError from "@/components/Dashboard/WidgetManagement/WidgetWrapperError";

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
  const intl = useIntl();
  const performanceLabel = intl.formatMessage({
    id: `student.report.tabs.performance`,
    defaultMessage: `Performance`,
  });
  const [error, setError] = useState<boolean>(false);
  const links = [
    {
      label: intl.formatMessage({
        id: `navMenu_studentReportTitle`,
        defaultMessage: `Student Report`,
      }),
      href: `#/student-report`,
    },
  ];

  const setClass = (classDetail: ClassDetail) => {
    setClassDetail(classDetail);
    setTab(`performance`);
  };

  return error ? <WidgetWrapperError />  :
      <Box padding={2}>
        <Box paddingY={1}>
          <Breadcrumb links={links} />
        </Box>
        <ClassTabs onClassChange={setClass} setError={setError} />
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={(_, tab) => setTab(tab)}>

                <Tab label={performanceLabel} value="performance" />
              </TabList>
            </Box>
            <TabPanel value="performance" sx={{ padding: 0 }}>
              {classDetail && <Performance {...classDetail} />}
            </TabPanel>
          </TabContext>
      </Box>;
}
