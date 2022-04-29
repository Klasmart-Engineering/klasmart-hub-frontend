import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
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
import classRoastersData from './mockClassRoastersData';
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

const mockData: ClassRoasters = classRoastersData;


interface Performance {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}
interface ClassDetail {
  class_id: number;
  class_name: string;
  performance: Performance;
}
interface ClassRoasters {
  total: number;
  classes: ClassDetail[];
}

interface Props {
  onClassChange: (classDetail: ClassDetail) => void;
}

export default function ClassTabs({ onClassChange }: Props) {
  const style = useStyles();
  const classesData = mockData;
  const [classess, setClassess] = useState<ClassDetail[]>(classesData.classes || []);
  const [count, setCount] = useState(1);
  const tabsRef = createRef<any>();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const selectClass = (classDetail: ClassDetail) => {
    onClassChange(classDetail);
    const index = classess.findIndex((v: ClassDetail) => v.class_id === classDetail.class_id);
    classess.splice(index, 1);
    setClassess([classDetail, ...classess]);
  };
  const handleClose = (classDetail: ClassDetail) => {
    setAnchorEl(null);
    selectClass(classDetail);
  };

  useEffect(() => {
    onClassChange(classess[0]);
  });

  useEffect(() => {
    // Delay for element to adjust the size
    const updateCountTimer = setTimeout(() => {
      const element = tabsRef.current;
      if (!element) return;
      // Getting access to class list array
      const classess = Array.from(
        element?.children[0]?.children[0]?.children || []
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
        value={0}
        scrollButtons={false}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
          [`& .${tabsClasses.indicator}`]: {
            backgroundColor: `unset`,
          },
          margin: `auto`,
        }}
        ref={tabsRef}
      >
        {classess.map((classDetail, index) => (
          <ClassTab
            key={classDetail.class_id}
            label={classDetail.class_name}
            onClick={() => selectClass(classDetail)}
            className={index === 0 ? `` : style.seperator}
          />
        ))}
      </Tabs>
      <Box className={style.chip}>
        <Chip
          label={`+${count}`}
          variant='outlined'
          color='primary'
          onClick={handleClick}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose(classess[0])}
          PaperProps={{
            style: {
              maxHeight: 210,
            },
          }}
        >
          {classess
            ?.slice(classess.length - count - 1)
            .map((classDetail, index) => (
              <MenuItem key={index} onClick={() => handleClose(classDetail)}>
                {classDetail.class_name}
              </MenuItem>
            ))}
        </Menu>
      </Box>
    </Box>
  );
}
