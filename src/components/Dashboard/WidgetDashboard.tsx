import "react-grid-layout/css/styles.css";
import { WidgetView } from "@/components/Dashboard/WidgetManagement/defaultWidgets";
import WidgetDashboardWelcomeBanner from "@/components/Dashboard/WidgetManagement/WidgetDashboardWelcomeBanner";
import WidgetGrid from "@/components/Dashboard/WidgetManagement/WidgetGrid";
import {
    Box,
    Container,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import clsx from "clsx";
import React from "react";
import ReactResizeDetector from 'react-resize-detector';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            backgroundColor: `#f2f3f8`,
            height: `100%`,
            transition: `.5s background-color`,
        },
        rootEditing: {
            backgroundColor: `#48484c`,
        },
    }));

interface Props {
    view: WidgetView;
}

export default function HomeWidgets (props: Props) {
    const { view } =  props;
    const classes = useStyles();

    return (
        <Box className={clsx(classes.root)}>
            <WidgetDashboardWelcomeBanner view={view}/>
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
                                view={view}
                            />
                        }
                    </ReactResizeDetector>
                </Container>
            </Box>
        </Box>
    );
}
