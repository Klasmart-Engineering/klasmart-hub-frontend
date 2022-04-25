import { Box, Tab } from "@mui/material";
import React, { useState } from "react";
import {
  TabContext,
  TabList,
  TabPanel
} from "@mui/lab";
import Breadcrumb from "@/components/TeachersStudentProgressReport/BreadCrumb";
import ClassTabs from "@/components/TeachersStudentProgressReport/ClassTabs";
import { useIntl } from "react-intl";

interface Performance {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}

interface ClassObj {
  class_id: number;
  class_name: string;
  performance: Performance;
}

interface Props { }

export default function StudentReport(props: Props) {
  const [tab, setTab] = useState(`performance`);
  const [classObj, setClassObj] = useState<ClassObj>();
  const intl = useIntl();

  const performanceLabel = intl.formatMessage({
    id: `student.report.tabs.performance`,
    defaultMessage: `Performance`,
  });

  const links = [
    {
      label: intl.formatMessage({
        id: `navMenu_studentReportTitle`,
        defaultMessage: `Student Report`,
      }),
      href: `#/student-report`,
    },
  ];

  const setClass = (classObj: ClassObj) => {
    setClassObj(classObj);
    setTab(`performance`);
  };

  return (
    <Box padding={2}>
      <Box paddingY={1}>
        <Breadcrumb links={links} />
      </Box>
    <ClassTabs onClassChange={setClass} />
      <Box>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={(_, tab) => setTab(tab)}>
              <Tab label={performanceLabel} value="performance" />
            </TabList>
          </Box>
          <TabPanel value="performance"></TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
}
