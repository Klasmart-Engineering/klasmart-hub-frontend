import { WidgetType } from "../../models/widget.model";
import {
    Layout,
    Layouts,
    Widgets,
} from "./defaultWidgets";
import { createContext } from "react";

type Context = {
    editing: boolean;
    editWidgets: () => void;
    cancelEditing: () => void;
    widgets : Widgets;
    resetWidgets: () => void;
    saveWidgets: ( widgets: Widgets, layouts: Layouts) => void;
    addWidget: (id: WidgetType, widgets: Widgets, layouts: Layouts) => void;
    removeWidget: (id: WidgetType, widgets: Widgets, layouts: Layouts) => void;
    loadWidgets: () => void;
    reorderWidgets: (layout: Layout[]) => void;
    layouts: Layouts;
}

export const defaultContext = {} as Context;

const WidgetContext = createContext(defaultContext);

export default WidgetContext;
