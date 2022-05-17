import ClassRoster from './ClassRoster';
import PerformanceRates from "./PerformanceRates/PerformanceRates";
import Statistics from './Statistics';
import { Box, Grid } from '@mui/material';
import { ParentSize } from '@visx/responsive';
import React,
{
    useEffect,
    useState
} from 'react';
import { ClassDetail, Performance } from '@/api/sprReportApi';
import WidgetWrapperError from '../Dashboard/WidgetManagement/WidgetWrapperError';
import { GroupNameAll } from './PerformanceRates/DataFormatter';

interface Props extends ClassDetail {
}
interface StudentProps {
    student_id: string;
    student_name: string;
    avatar: string;
}

export default function PerformanceTab(props: Props) {
    const { class_id, performance } = props;
    const [selectedNode, setSelectedNode] = useState<string | undefined>();
    const [selectedStudent, setSelectedStudent] = useState<StudentProps>();
    const [selectedGroup, setSelectedGroup] = useState<GroupNameAll>(`all`);
    const [error, setError] = useState<boolean>(false);
    const handleSelect = (id: string) => {
        setSelectedNode(id);
    };
    const updateStudentData = (obj : StudentProps) => {
        setSelectedStudent(selectedStudent?.student_id === obj.student_id ? undefined : obj);
    }
    const updateGroup = (id: GroupNameAll) => {
        setSelectedGroup(id);
    }
    useEffect(() => {
        setError(false);
    }, [class_id]);

    return (
        <>
            <Statistics performance={performance} />
            {error ? <WidgetWrapperError /> :
                <Grid container spacing={2} wrap={'wrap'}>
                    <Grid item md={3} xs={12}>
                        <ClassRoster
                            class_id={class_id}
                            handleSelect={handleSelect}
                            setError={setError}
                            selectedNodeId={selectedNode}
                            updateStudentData={updateStudentData}
                            updateGroup={updateGroup}
                            selectedGroup={selectedGroup}
                        />
                    </Grid>
                    <Grid item md={9} xs={12}>
                        <ParentSize>
                            {({ width, height }) => (
                                <PerformanceRates
                                    selectedNodeId={selectedNode}
                                    class_id={class_id}
                                    selectedStudent={selectedStudent}
                                    width={width}
                                    height={height}
                                    selectedGroup={selectedGroup}
                                />
                            )}
                        </ParentSize>
                    </Grid>
                </Grid>}
        </>);
}
