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
import { ClassDetail, Performance } from '@/api/sprreportapi';
import WidgetWrapperError from '../Dashboard/WidgetManagement/WidgetWrapperError';

interface Props extends ClassDetail {
}
interface StudentProps {
    student_id: string;
    student_name: string;
    avatar: string;
}

export default function PerformanceTab(props: Props) {
    const { class_id, performance } = props;
    const [selectedNode, setSelectedNode] = useState<string>(`all`);
    const [selectedStudent, setSelectedStudent] = useState<StudentProps>();
    const [error, setError] = useState<boolean>(false);
    const handleSelect = (id: string) => {
        setSelectedNode(id);
    };
    const updateStudentData = (obj : StudentProps) => {
        setSelectedStudent(selectedStudent?.student_id === obj.student_id ? undefined : obj);
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
                                />
                            )}
                        </ParentSize>
                    </Grid>
                </Grid>}
        </>);
}
