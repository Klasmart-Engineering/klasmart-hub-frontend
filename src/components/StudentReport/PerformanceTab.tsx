import ClassRoster from './ClassRoster';
import PerformanceRates from "./PerformanceRates/PerformanceRates";
import Statistics from './Statistics';
import { Box, Grid } from '@mui/material';
import { ParentSize } from '@visx/responsive';
import React,
{ useState } from 'react';

interface Performance {
    total_students: number;
    average_performance: number;
    today_total_classes: number;
    today_activities: number;
}
interface PerformanceGrade {
    id: string;
    name: string;
    color: string;
    students: Student[];
}
interface Student {
    student_id: string;
    student_name: string;
    avatar: string;
}

interface Props {
    class_id: number;
    performance: Performance;
}

export default function PerformanceTab(props: Props) {
    const { class_id, performance } = props;
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(``);

    const handleSelect = (id: string | undefined) => {
        setSelectedNodeId(id);
    };

    return (
        <>
            <Statistics performance={performance} />
            <Grid container spacing={2}>
                <Grid item md={3}>
                    <ClassRoster
                        class_id={class_id}
                        handleSelect={handleSelect}
                        selectedNodeId={selectedNodeId}
                    />
                </Grid>
                <Grid item md={9}>
                    <ParentSize>
                        {({ width, height }) => (
                            <PerformanceRates
                                selectedNodeId={selectedNodeId}
                                width={width}
                                height={height}
                            />
                        )}
                    </ParentSize>
                </Grid>
            </Grid>
        </>
    );
}
