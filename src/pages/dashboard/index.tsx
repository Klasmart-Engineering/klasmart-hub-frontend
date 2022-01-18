import "react-grid-layout/css/styles.css";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetDashboardWelcomeBanner from "@/components/Dashboard/WidgetManagement/WidgetDashboardWelcomeBanner";
import WidgetGrid from "@/components/Dashboard/WidgetManagement/WidgetGrid";
import {
    Box,
    Container,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";
import { Layout } from "react-grid-layout";
import ReactResizeDetector from 'react-resize-detector';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            backgroundColor: `#f2f3f8`,
            height: `100%`,
        },
    }));

interface Props {
}

export default function HomeWidgets (props: Props) {
    const classes = useStyles();

    const lgLayout: Layout[] = [
        /* eslint-disable */
        { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
        { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 4 },
        { i: WidgetType.ATTENDANCERATE,     x: 4, y: 1, h: 3, w: 4 },
        { i: WidgetType.PENDINGASSESSMENTS, x: 8, y: 1, h: 3, w: 4 },
        { i: WidgetType.TEACHERLOAD,        x: 0, y: 2, h: 3, w: 4 },
        { i: WidgetType.CONTENTSTATUS,      x: 4, y: 2, h: 3, w: 4 },
        /* eslint-enable */
    ];

    const mdLayout: Layout[] = [
        /* eslint-disable */
        { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
        { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 6 },
        { i: WidgetType.ATTENDANCERATE,     x: 6, y: 1, h: 3, w: 6 },
        { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 2, h: 3, w: 6 },
        { i: WidgetType.TEACHERLOAD,        x: 6, y: 2, h: 3, w: 6 },
        { i: WidgetType.CONTENTSTATUS,      x: 0, y: 3, h: 3, w: 6 },
        /* eslint-enable */
    ];

    const smLayout: Layout[] = [
        /* eslint-disable */
        { i: WidgetType.SCHEDULE,           x: 0, y: 4, h: 3, w: 12 },
        { i: WidgetType.NEXTCLASS,          x: 0, y: 0, h: 4, w: 12 },
        { i: WidgetType.ATTENDANCERATE,     x: 0, y: 8, h: 3, w: 12 },
        { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 12, h: 3, w: 12 },
        { i: WidgetType.TEACHERLOAD,        x: 0, y: 16, h: 3, w: 12 },
        { i: WidgetType.CONTENTSTATUS,      x: 0, y: 20, h: 3, w: 12 },
        /* eslint-enable */
    ];

    return (
        <Box className={classes.root}>
            <WidgetDashboardWelcomeBanner />
            <Box
                paddingY={2} >
                <Container
                    maxWidth="xl"
                >
                    <ReactResizeDetector
                        handleWidth
                        handleHeight
                    >
                        {() =>
                            <WidgetGrid
                                layouts={{
                                    lg: lgLayout,
                                    md: mdLayout,
                                    sm: smLayout,
                                }}
                                isDraggable={false}
                            />
                        }
                    </ReactResizeDetector>;
                </Container>
            </Box>
        </Box>

    );
}
