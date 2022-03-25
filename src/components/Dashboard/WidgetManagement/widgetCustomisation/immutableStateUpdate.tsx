import { State } from "@/components/Dashboard/WidgetDashboard";
import {
    Layouts,
    Widgets,
} from "@/components/Dashboard/WidgetManagement/defaultWidgets";
import React from "react";

const immutableStateUpdate = (setter: React.Dispatch<React.SetStateAction<State>>, widgets: Widgets, layouts: Layouts) => {
    setter((previousState: State) => {
        const newState = {
            ...previousState,
        };
        newState.widgets = widgets,
        newState.layouts = layouts;
        return newState;
    });
};

export default immutableStateUpdate;
