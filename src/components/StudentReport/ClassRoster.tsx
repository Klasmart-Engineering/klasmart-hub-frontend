import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Theme } from "@mui/material/styles";
import {
  createStyles,
  makeStyles,
} from '@mui/styles';
import { Avatar, Divider, TextField } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import highIcon from "@/assets/img/studentreports/classroster/high.png";
import averageIcon from "@/assets/img/studentreports/classroster/average.png";
import lowIcon from "@/assets/img/studentreports/classroster/low.png";
import { IntlShape, useIntl } from "react-intl";
import { useSPRReportAPI } from '@/api/sprReportApi';
import { GroupNameAll } from './PerformanceRates/DataFormatter';
import { GetPerformancesGroupRepsonse } from '@/api/sprReportApi';
declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type ClassRosterTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelInfo?: string;
  labelText: string;
  count?: number;
  imgUrl?: string;
  gradeImg?: string;
  intl?: IntlShape;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderBottomLeftRadius: 30,
      borderTopLeftRadius: 10,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.primary.light})`,
      color: 'var(--tree-view-color)',
      borderBottomLeftRadius: 30,
      borderTopLeftRadius: 10,
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const CustomSearchField = styled(TextField)(({ theme }) => (
  {
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        borderRadius: 20,
        borderColor: theme.palette.grey[200],
      },
      fontSize: `0.8rem`,
    },
    "& .MuiOutlinedInput-root:hover": {
      "& > fieldset": {
        borderColor: theme.palette.grey[200],
      }
    }
  }
));

const useFilterTreeStyles = makeStyles((theme: Theme) => createStyles({
  componentTitle: {
    fontWeight: 600,
    fontSize: '0.8rem',
    color: theme.palette.grey[600],
    paddingBottom: theme.spacing(0.5),
  },
  content: {
    flexDirection: "row-reverse",
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  middleContent: {
    display: `flex`,
    flexDirection: `column`,
  },
  labelTextParent: {
    color: theme.palette.common.black,
    fontWeight: 600,
    fontSize: '0.8rem',
  },
  labelTextChild: {
    color: theme.palette.common.black,
    fontWeight: 400,
    fontSize: '0.8rem',
    padding: theme.spacing(0.5),
  },
  totalStudents: {
    fontSize: '0.7rem',
    fontWeight: 500,
  },
  studentAvatar: {
    fontSize: `0.9rem`,
    fontWeight: 200,
  },
  gradeAvatar: {
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
    paddingTop: theme.spacing(0.4),
  },
  input: {
    height: 25,
  },
  filterTreeContainer: {
    width: `100%`,
    height: `551px`,
    padding: theme.spacing(2),
    borderRadius: 10,
    border: `1px solid`,
    borderColor: theme.palette.grey[300],
  },
  filterContainer: {
    borderRadius: theme.spacing(2.5),
    backgroundColor: theme.palette.grey[200],
  },
  treeviewContainer: {
    paddingTop: theme.spacing(1),
  },
  divider: {
    borderBottomWidth: theme.spacing(0.3),
  },
  searchIcon: {
    width: `0.7em`,
    color: theme.palette.grey[400],
  },
  spacing4: {
    paddingLeft: theme.spacing(0.5),
  }
}));

const contains = (term: string) => ({ student_name }: Student) => student_name.toLowerCase().indexOf(term.toLowerCase()) !== -1;

const timeZoneOffset = new Date()
.getTimezoneOffset()/-60;

const getAvatarContent = (name: string) => {
  let splittedArray = name.trim().split(' ');
  return splittedArray.length > 1 ? splittedArray[0][0] + splittedArray[1][0] : splittedArray.length == 1 ? splittedArray[0][0] : ``;
}

const ClassRosterTreeItem = (props: ClassRosterTreeItemProps) => {
  const {
    bgColor,
    color,
    labelInfo,
    labelText,
    count,
    imgUrl,
    gradeImg,
    intl,
    ...other
  } = props;
  const classes = useFilterTreeStyles();
  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.2, pr: 0 }}>
          {gradeImg ?
            <img src={gradeImg} className={classes.gradeAvatar} />
            : <Avatar className={classes.studentAvatar}
              alt={labelText}
              src={imgUrl}
              sx={{
                bgcolor: color, width: 30, height: 30
              }}
            >{getAvatarContent(labelText)} </Avatar>
          }
          <div className={classes.spacing4}>
            <div className={classes.middleContent}>
              <Typography variant="body1" className={count ? classes.labelTextParent : classes.labelTextChild} sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                {labelText}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" className={classes.totalStudents} sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                {count} {count != 1 ? intl?.formatMessage({
                  id: `student.report.classroster.studentsLabel`,
                }) : intl?.formatMessage({
                  id: `student.report.classroster.studentLabel`,
                })}
              </Typography>
            </div>
          </div>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        content: classes.content
      }}
      {...other}
    />
  );
}
interface PerformanceGrade {
  id: GroupNameAll;
  name: string;
  color: string;
  students: Student[];
  total: number;
}
interface Student {
  student_id: string;
  student_name: string;
  avatar: string;
}

interface Props {
  class_id: string;
  selectedNodeId: string | undefined;
  selectedGroup: string;
  handleSelect: (id: string | undefined) => void;
  updateStudentData: (obj: Student) => void
  setError: (error: boolean) => void;
  updateGroup: (obj: GroupNameAll) => void
}

export default function ClassRoster(props: Props) {
  const intl = useIntl();
  const { class_id, handleSelect, updateStudentData, selectedNodeId, setError, updateGroup, selectedGroup } = props;

  const classes = useFilterTreeStyles();
  const [expanded, setExpanded] = useState<string[] | undefined>([]);
  const handleChange = (event: any, nodes: string[]) => setExpanded(nodes);
  const handleStudentClick = (id: string , student:Student) => {
    updateStudentData(student);
    handleSelect(selectedNodeId === student.student_id ? undefined : student.student_id);
  }
  const renderStudent = (student: Student, color: string, id: string) => <ClassRosterTreeItem key={student.student_id} onClick={() => handleStudentClick(id, student)} nodeId={student.student_id} labelText={student.student_name} color={color} imgUrl={student.avatar} />;

  const sprApi = useSPRReportAPI();
  useEffect(() => {
    let didUnmount = false;
    updateGroup("all");
    handleSelect(undefined);
    setSearchData('');
    setExpanded([]);
    sprApi.getPerformanceByGroups({
      classId: class_id,
      timezone: timeZoneOffset, // No Required
    }).then((data: GetPerformancesGroupRepsonse) => {
      if(!didUnmount) {
        formatData(data);
        setError(false);
      }
    })
    .catch((e: any) => {
      !didUnmount && setError(true);
    });
    return () => { didUnmount = true };
  }, [class_id]);

  const [initalData, setInitalData] = useState<PerformanceGrade[]>([]);
  const [filteredData, setFilteredData] = useState<PerformanceGrade[]>([]);
  const [searchData, setSearchData] = useState<string>('');

  const formatData = (classRosterGradeStudentList: any) => {
    const data = [{
      id: `above`,
      name: intl.formatMessage({
        id: `student.report.classroster.above`,
      }),
      color: `#40B8F4`,
      ...classRosterGradeStudentList?.above,
    },
    {
      id: `meets`,
      name: intl.formatMessage({
        id: `student.report.classroster.meets`,
      }),
      color: `#37BA00`,
      ...classRosterGradeStudentList?.meets,
    },
    {
      id: `below`,
      name: intl.formatMessage({
        id: `student.report.classroster.below`,
      }),
      color: `#FFBC00`,
      ...classRosterGradeStudentList.below,
    }];
    setInitalData(data);
    setFilteredData(data);
  };

  const getSearchData = (searchTerm: string, performanceCategories: PerformanceGrade[]) => {
    setSearchData(searchTerm);
    if (searchTerm === '') {
      setFilteredData(performanceCategories);
      setExpanded([]);
      return;
    }
    const filterStudents = performanceCategories.map(performanceCategory => ({
      ...performanceCategory,
      students: performanceCategory?.students.filter(contains(searchTerm)),
    }));
    const expandedNodes = filterStudents
      .filter(category => !!category.students.length)
      .map(caterogy => caterogy.id);
    setFilteredData(filterStudents);
    setExpanded(expandedNodes);
  }

  const renderPerformanceGradeTree = ((performanceGrade: PerformanceGrade, index: number, size: number) => {
    return (
      <div key={performanceGrade.id}>
        <ClassRosterTreeItem
           disabled={!performanceGrade.total}
           onClick={() => !!performanceGrade.total && updateGroup(selectedGroup === performanceGrade.id ? `all` : performanceGrade.id)} 
           nodeId={performanceGrade.id} 
           labelText={performanceGrade.name} 
           color={performanceGrade.color} 
           count={performanceGrade.students.length} 
           gradeImg={performanceGrade.id === 'above' ? highIcon : performanceGrade.id === 'meets' ? averageIcon : lowIcon} 
           intl={intl} 
        >
          {performanceGrade?.students?.map((student: Student) => renderStudent(student, performanceGrade.color, performanceGrade.id))}
        </ClassRosterTreeItem>
        {size != index + 1 ? <Divider className={classes.divider} /> : ``}
      </div>
    );
  });

  return (
    <Box>
      <Typography className={classes.componentTitle}>
        {intl.formatMessage({
          id: `student.report.classroster.title`,
        })}
      </Typography>
      <div className={classes.filterTreeContainer}>
      <div className={classes.filterContainer}>
          <CustomSearchField
            fullWidth
            value={searchData}
            InputProps={{
              endAdornment: (
                <SearchOutlined className={classes.searchIcon} />
              ),
              className: classes.input,
            }}
            placeholder={intl.formatMessage({
              id: `student.report.classroster.searchStudent`,
            })}
            variant="outlined"
            size="small"
            onChange={(e) => getSearchData(e.target.value, initalData)} />
        </div><div className={classes.treeviewContainer}>
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultEndIcon={<div style={{ width: 24 }} />}
              expanded={expanded}
              onNodeToggle={handleChange}
              sx={{ height: 450, flexGrow: 1, overflowY: 'auto' }}
            >
              {filteredData?.map((performanceGrade, index) => renderPerformanceGradeTree(performanceGrade, index, filteredData.length))}
            </TreeView>
          </div>
      </div>
    </Box>);
}
