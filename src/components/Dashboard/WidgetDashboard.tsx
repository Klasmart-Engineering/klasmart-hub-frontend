import "react-grid-layout/css/styles.css";
import immutableStateUpdate from "./WidgetManagement/widgetCustomisation/immutableStateUpdate";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import getLayouts, {
    Layout,
    Layouts,
    Widgets,
    WidgetView,
} from "@/components/Dashboard/WidgetManagement/defaultWidgets";
import {
    addSingleWidget,
    removeSingleWidget,
    updateWidgetOrders,
    orderWidgetsArray
} from "@/components/Dashboard/WidgetManagement/widgetCustomisation/modifyWidgets";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import {
    deleteLocalWidgets,
    getLocalWidgets,
    setLocalWidgets,
} from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetStorage";
import WidgetDashboardWelcomeBanner from "@/components/Dashboard/WidgetManagement/WidgetDashboardWelcomeBanner";
import WidgetGrid from "@/components/Dashboard/WidgetManagement/WidgetGrid";
import { useCurrentOrganizationMembership } from "@/store/organizationMemberships";
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
{
    useEffect,
    useState,
} from "react";
import ReactResizeDetector from 'react-resize-detector';
import ConfirmBox from "./WidgetManagement/Dialog/ConfirmBox";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            backgroundColor: `#f2f3f8`,
            minHeight: `100vh`,
            transition: `.5s background-color`,
        },
        rootEditing: {
            backgroundColor: `#48484c`,
        },
    }));

interface Props {
    view: WidgetView;
}

export interface State {
    widgets: Widgets;
    layouts: Layouts;
}

export default function HomeWidgets(props: Props) {
    const currentOrganizationMembership = useCurrentOrganizationMembership();
    const organizationId = currentOrganizationMembership?.organization?.id;
    const userId = currentOrganizationMembership?.userId;
    const { view } = props;
    const classes = useStyles();
    const storageId = `${view}_${userId}_${organizationId}`;
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const checkIfUnsavedChanges = (previous: any, newLayouts: any) => {
        const newOrder = orderWidgetsArray(newLayouts || []);
        const previousOrder = orderWidgetsArray(previous || []);
        // check widget added or removed
        if (previousOrder.length !== newOrder.length) {
            return true;
        }
        // check if order is changed
        return !!previousOrder
            .find((layout, index) => previousOrder[index]?.i !== layout?.i);
    }
    // We use three versions of state
    // currentState is used to display the widgets and layouts
    // editingState is used to track what changes are made during edit and overwrite currentState during edit
    // savedState is a fallback copy of currentState that we can revert to if the user cancels their edit

    const [savedState, setSavedState] = useState<State>({} as State);
    const [editingState, setEditingState] = useState<State>({} as State);
    const [currentState, setCurrentState] = useState<State>({} as State);
    const [editing, setEditing] = useState<boolean>(false);

    useEffect(() => {
        const { widgets, layouts } = getLocalWidgets(storageId, view);
        const defaultWidgets = Object.assign({}, widgets);
        const defaultLayouts = Object.assign({}, layouts);
        immutableStateUpdate(setEditingState, defaultWidgets, defaultLayouts);
        immutableStateUpdate(setCurrentState, defaultWidgets, defaultLayouts);
    }, [view]);

    useEffect(() => {
        const { widgets, layouts } = getLocalWidgets(storageId, view);
        const defaultWidgets = Object.assign({}, widgets);
        const defaultLayouts = Object.assign({}, layouts);
        immutableStateUpdate(setSavedState, defaultWidgets, defaultLayouts);
    }, [editing]);

    const editWidgets = () => {
        setEditing(true);
    };

    const checkIfLayoutUpdated = () => {
        const isLayoutChanged = checkIfUnsavedChanges(editingState.layouts.lg, savedState.layouts.lg);
        isLayoutChanged ? setOpenConfirmDialog(true) : cancelEditing();
    }

    const resetWidgets = () => {
        deleteLocalWidgets(storageId);
        const { widgets, layouts } = getLayouts(view);
        const defaultLayouts = Object.assign({}, layouts);
        const reorderedLayouts = updateWidgetOrders(defaultLayouts.lg, view);
        const defaultWidgets = Object.assign({}, widgets);
        immutableStateUpdate(setSavedState, defaultWidgets, reorderedLayouts);
        immutableStateUpdate(setEditingState, defaultWidgets, reorderedLayouts);
        immutableStateUpdate(setCurrentState, defaultWidgets, reorderedLayouts);
        setEditing(false);
    };

    const saveWidgets = (widgets: Widgets, layouts: Layouts) => {
        setLocalWidgets(widgets, layouts, storageId);
        const { widgets: editingWidgets, layouts: editingLayouts } = editingState;
        immutableStateUpdate(setSavedState, editingWidgets, editingLayouts);
        immutableStateUpdate(setCurrentState, editingWidgets, editingLayouts);
        setEditing(false);
    };

    const cancelEditing = () => {
        const savedWidgets = savedState.widgets;
        const savedLayouts = updateWidgetOrders(savedState.layouts.lg, view);
        immutableStateUpdate(setEditingState, savedWidgets, savedLayouts);
        immutableStateUpdate(setCurrentState, savedWidgets, savedLayouts);
        setEditing(false);
    };

    const addWidget = (id: WidgetType, widgets: Widgets, layouts: Layouts) => {
        const { widgets: revisedWidgets, layouts: revisedLayouts } = addSingleWidget(id, widgets, layouts, view);
        immutableStateUpdate(setEditingState, revisedWidgets, revisedLayouts);
        immutableStateUpdate(setCurrentState, revisedWidgets, revisedLayouts);
        scrollTo(`#widgetDashBaord`);
    };

    const removeWidget = (id: WidgetType, widgets: Widgets, layouts: Layouts) => {
        const { widgets: revisedWidgets, layouts: revisedLayouts } = removeSingleWidget(id, widgets, layouts, view);
        immutableStateUpdate(setEditingState, revisedWidgets, revisedLayouts);
        immutableStateUpdate(setCurrentState, revisedWidgets, revisedLayouts);
    };

    const reorderWidgets = (layout: Layout[]) => {
        const newLayouts = updateWidgetOrders(layout, view);
        const { widgets } = currentState;
        immutableStateUpdate(setEditingState, widgets, newLayouts);
        immutableStateUpdate(setCurrentState, widgets, newLayouts);
    };

    const scrollTo = (selector: string) => {
        setTimeout(() => {
            const element = document.querySelector(selector);
            if (!element) return;
            element.scrollIntoView({
                behavior: `smooth`,
                block: `end`,
            });
        }, 500);
    };

    return (
        <WidgetContext.Provider value={{
            editing,
            editWidgets,
            cancelEditing,
            widgets: currentState.widgets,
            resetWidgets,
            saveWidgets,
            addWidget,
            removeWidget,
            reorderWidgets,
            checkIfLayoutUpdated,
            layouts: currentState.layouts,
            view,
        }}>
            <Box className={clsx(classes.root, {
                [classes.rootEditing]: editing,
            })}>
                <WidgetDashboardWelcomeBanner view={view} />
                <Box
                    paddingY={2} >
                    <Container
                        maxWidth="xl"
                    >
                        <ReactResizeDetector
                            handleWidth
                            handleHeight
                        >
                            {currentState.layouts &&
                                <WidgetGrid
                                    view={view}
                                />
                            }
                        </ReactResizeDetector>
                    </Container>
                </Box>
            </Box>
            <ConfirmBox
                open={openConfirmDialog}
                confirm={cancelEditing}
                onClose={() => setOpenConfirmDialog(false)}
            ></ConfirmBox>
        </WidgetContext.Provider>
    );
}
