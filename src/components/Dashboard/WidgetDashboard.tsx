import "react-grid-layout/css/styles.css";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import {
    Layout,
    Layouts,
    Widgets,
} from "@/components/Dashboard/WidgetManagement/widgetCustomisation/defaultWidgets";
import {
    addSingleWidget,
    removeSingleWidget,
    updateWidgetOrders,
} from "@/components/Dashboard/WidgetManagement/widgetCustomisation/modifyWidgets";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import {
    initialState,
    reducer,
    WidgetActions,
} from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetReducer";
import {
    deleteLocalWidgets,
    getLocalWidgets,
    setLocalWidgets,
} from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetStorage";
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
import React,
{ useReducer } from "react";
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
}

export default function HomeWidgets (props: Props) {
    const classes = useStyles();
    const [
        {
            editing, widgets, layouts,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    const editWidgets = () => dispatch({
        type: WidgetActions.EDIT,
    });

    const resetWidgets = () => {
        deleteLocalWidgets();
        dispatch({
            type: WidgetActions.RESET,
        });
    };

    const saveWidgets = (widgets: Widgets, layouts: Layouts) => {
        setLocalWidgets(widgets, layouts);
        dispatch({
            type: WidgetActions.SAVE,
            payload: {
                widgets,
                layouts,
            },
        });
    };

    const cancelEditing = () => {
        dispatch({
            type: WidgetActions.CANCEL,
        });
    };

    const addWidget = (id: WidgetType, widgets: Widgets, layouts: Layouts) => {
        const { widgets: revisedWidgets, layouts: revisedLayouts } = addSingleWidget(id, widgets, layouts);
        dispatch({
            type: WidgetActions.ADD,
            payload: {
                widgets: revisedWidgets,
                layouts: revisedLayouts,
            },
        });
    };

    const removeWidget = (id: WidgetType, widgets: Widgets, layouts: Layouts) => {
        const { widgets: revisedWidgets, layouts: revisedLayouts } = removeSingleWidget(id, widgets, layouts);
        dispatch({
            type: WidgetActions.REMOVE,
            payload: {
                widgets: revisedWidgets,
                layouts: revisedLayouts,
            },
        });
    };

    const loadWidgets = () => {
        const preferences = getLocalWidgets(initialState.widgets, initialState.layouts);
        const { widgets, layouts } = preferences;
        dispatch({
            type: WidgetActions.LOAD,
            payload: {
                widgets,
                layouts,
            },
        });
    };

    const reorderWidgets = (layout: Layout[]) => {
        const newLayouts = updateWidgetOrders(layout);
        dispatch({
            type: WidgetActions.REORDER,
            payload: {
                layouts: newLayouts,
            },
        });
    };

    return (
        <WidgetContext.Provider value={{
            editing,
            editWidgets,
            cancelEditing,
            widgets,
            resetWidgets,
            saveWidgets,
            addWidget,
            removeWidget,
            loadWidgets,
            reorderWidgets,
            layouts,
        }}>
            <Box className={clsx(classes.root, {
                [classes.rootEditing] : editing,
            })}>
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
                                    isDraggable={editing}
                                />
                            }
                        </ReactResizeDetector>
                    </Container>
                </Box>
            </Box>
        </WidgetContext.Provider>
    );
}
