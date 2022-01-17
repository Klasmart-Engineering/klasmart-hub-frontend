import AttendanceRateWidget from "../Widgets/AttendanceRate/AttendanceRate";
import ContentStatusWidget from "../Widgets/ContentStatus/ContentStatus";
import NextClassWidget from "../Widgets/NextClass/NextClass";
import PendingAssessmentsWidget from "../Widgets/PendingAssessments/PendingAssessments";
import TeacherLoadWidget from "../Widgets/TeacherLoadWidget/TeacherLoadWidget";
import TodaysScheduleWidget from "../Widgets/TodaysSchedule/TodaysSchedule";
import {
    Widget,
    WidgetType,
} from "@/components/Dashboard/models/widget.model";
import { styled } from "@material-ui/core";
import React,
{
    ReactElement,
    useEffect,
    useState,
} from "react";
import {
    Layout,
    Layouts,
    Responsive,
    ResponsiveProps,
    WidthProvider,
} from 'react-grid-layout';

const GridStyleOverride = styled(Responsive)<{ component?: React.ElementType }>({
    '& .react-grid-item.react-grid-placeholder': {
        backgroundColor: `rgba(255,255,255,0.9)`,
        borderRadius: 20,
    },
});

const ResponsiveGridLayout = WidthProvider(GridStyleOverride);

interface Props {
    layouts: { [P: string]: Layout[] };
    isDraggable: boolean;
}

export default function WidgetGrid (props: Props) {
    const [ layoutArray, setLayoutArray ] = useState<Layout[]>([]);
    const [ breakpoint, setBreakpoint ] = useState<string>(`lg`);

    const { layouts, isDraggable } = props;

    const widgetMap:{ [P: string]: ReactElement } = {
        [WidgetType.SCHEDULE]: <TodaysScheduleWidget />,
        [WidgetType.NEXTCLASS]: <NextClassWidget />,
        [WidgetType.ATTENDANCERATE]: <AttendanceRateWidget />,
        [WidgetType.PENDINGASSESSMENTS]: <PendingAssessmentsWidget />,
        [WidgetType.TEACHERLOAD]: <TeacherLoadWidget />,
        [WidgetType.CONTENTSTATUS]: <ContentStatusWidget />,
    };

    const responsiveProps: ResponsiveProps = {
        autoSize: true,
        isResizable: false,
        margin: [ 15, 15 ],
        rowHeight: 100,
        isDraggable: isDraggable,
        isBounded: true,
        onBreakpointChange:(newBreakpoint: string, newCols: number) => {
            setBreakpoint(newBreakpoint);
        },
        onLayoutChange: (currentLayout: Layout[], allLayouts: Layouts) => {
            setLayoutArray(layouts[breakpoint]);
        },
    };

    useEffect(() => {
        // dispatch resize everytime the grid updates
        window.dispatchEvent(new Event(`resize`));
    });

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            {...responsiveProps}
            breakpoints={{
                lg: 1200,
                md: 768,
                sm: 480,
            }}
            cols={{
                lg: 12,
                md: 12,
                sm: 12,
            }}>
            {
                layoutArray.map((layout:Layout) => {
                    return <div key={layout.i}>{widgetMap[layout.i]}</div>;
                })
            }
        </ResponsiveGridLayout>
    );
}
