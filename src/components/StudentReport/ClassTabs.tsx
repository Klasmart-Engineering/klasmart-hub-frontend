import { createStyles, makeStyles } from '@mui/styles';
import { Theme, createTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Menu,
  MenuItem,
  styled,
  Tab,
  Tabs,
  tabsClasses,
} from '@mui/material';
import React, { createRef, useEffect, useState } from 'react';
import { classRoastersData } from './mockClassRoastersData';
import { useCurrentOrganization } from '@/store/organizationMemberships';
import { ClassDetail, useSPRReportAPI } from '@/api/sprReportApi';
import { GetClassesRepsonse } from '@/api/sprReportApi';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    seperator: {
      overflow: `unset`,
      marginLeft: `0`,
      marginRight: `0`,
      '&::after': {
        content: '""',
        border: `none`,
        borderRight: `2px solid ${theme.palette.divider}`,
        height: `40%`,
        position: `absolute`,
        top: `30%`,
        bottom: `30%`,
        right: `0`,
      },
    },
    classessBar: {
      position: 'relative',
    },
    chip: {
      position: `absolute`,
      top: `0`,
      bottom: `0`,
      right: `0`,
      display: `grid`,
      placeContent: `center`,
      background: theme.palette.common.white,
      padding: theme.spacing(0, 2),
    },
  })
);

const timeZoneOffset = new Date()
  .getTimezoneOffset() / -60;

const isInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return !(
    rect.top >= 0 &&
    rect.left >= 20 &&
    rect.bottom <=
    (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

interface ClassTabProp {
  label: string;
  className: string;
  onClick: () => void;
}

const ClassTab = styled((props: ClassTabProp) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: theme.palette.common.black,
  borderRadius: theme.spacing(5),
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(1, 3),
  minHeight: theme.spacing(1),
  '&.Mui-selected': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.common.white,
  },
}));

interface Performance {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}

interface Props {
  onClassChange: (classDetail: ClassDetail) => void;
  setError: (error: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export default function ClassTabs({ onClassChange, setError, setLoading}: Props) {
  const style = useStyles();
  const theme = createTheme();
  const [classess, setClassess] = useState<ClassDetail[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassDetail>();
  const [count, setCount] = useState(1);
  const tabsRef = createRef<any>();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const sprApi = useSPRReportAPI();
  const currentOrganization = useCurrentOrganization();
  const orgId = currentOrganization?.id || ``;
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    let unMounted = false;
    setLoading(true);
    sprApi.getClasses({
      orgId,
      isTeacher: true,
      timezone: timeZoneOffset, // No Required
    }).then((data: GetClassesRepsonse) => {
      if(!unMounted) {
        onClassChange(data?.classes[0]);
        setClassess(data?.classes || []);
        setSelectedClass(data?.classes[0]);
        setError(!data?.classes.length);
      }
    })
      .catch(() => !unMounted && setError(true))
      .then(() => !unMounted && setLoading(false));
    return () => { unMounted = true };
  }, [orgId]);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const selectClass = (classDetail: ClassDetail) => {
    onClassChange(classDetail);
    setSelectedClass(classDetail);
    setIndex(classess.findIndex((v: ClassDetail) => v.class_id === classDetail?.class_id))
  };
  const handleClose = (classDetail: ClassDetail) => {
    setAnchorEl(null);
    selectClass(classDetail);
  };

  useEffect(() => {
    // Delay for element to adjust the size
    const updateCountTimer = setTimeout(() => {
      const element = tabsRef.current;
      if (!element) return;
      // Getting access to class list array
      const classess = Array.from(
        element?.children[1]?.children[0]?.children || []
      );
      // filter the number of class name outside of view.
      const count = classess.filter(isInViewport).length;
      setCount(count);
    }, 200);
    return () => clearTimeout(updateCountTimer);
  }, [tabsRef]);

  return (
    <Box className={style.classessBar}>
      <Tabs
        value={index}
        scrollButtons={false}
        variant="scrollable"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
          [`& .${tabsClasses.indicator}`]: {
            backgroundColor: `unset`,
          },
          marginRight: `auto`,
          width: '90%',
        }}
        ref={tabsRef}
      >
        {classess.map((classDetail, i) => (
          <ClassTab
            key={classDetail.class_id}
            label={classDetail.class_name}
            onClick={() => selectClass(classDetail)}
            className={ ((i === index) || (i === index - 1) || (i === classess.length - 1)) ? `` : style.seperator}
          />
        ))}
      </Tabs>
      <Box className={style.chip}>
        {!!count && <Chip
          label={`+${count}`}
          variant='outlined'
          color='primary'
          onClick={handleClick}
        />}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose(classess[0])}
          PaperProps={{
            style: {
              boxShadow: `none`,
              marginTop: theme.spacing(2),
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: theme.spacing(3),
              overflow: `hidden`,
            },
          }}
        >
          <Box style={{
            overflowY: 'auto',
            maxHeight: 210,
            padding: theme.spacing(1),
          }}>
            {classess
              ?.slice(classess.length - count - 1)
              .map((classDetail, index) => (
                <MenuItem style={{ borderRadius: theme.spacing(1.2) }} key={index} onClick={() => handleClose(classDetail)}>
                  {classDetail.class_name}
                </MenuItem>
              ))}
          </Box>
        </Menu>
      </Box>
    </Box>
  );
}
