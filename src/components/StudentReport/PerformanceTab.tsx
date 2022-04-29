import ClassRoster from './ClassRoster';
import Statistics from './Statistics';
import React from 'react';

interface Performance {
    total_students: number;
    average_performance: number;
    today_total_classes: number;
    today_activities: number;
}

interface Props {
    class_id: number;
    performance: Performance;
}

export default function PerformanceTab (props: Props) {
    const { class_id, performance } = props;
    return (
        <>
            {<Statistics performance={performance} />}
            {<ClassRoster class_id={class_id} />}
        </>
    );
}
