import { WidgetType } from "../../models/widget.model";
import {
    defaultWidgetMap,
    Layouts,
    Widgets,
} from "./defaultWidgets";

const localStorageWidgetKey = `kl_widgets`;
const localStorageLayoutKey = `kl_layouts`;

export const getLocalWidgets = (widgets: Widgets, layouts: Layouts) => {
    const localWidgets = localStorage.getItem(localStorageWidgetKey);
    const localLayouts = localStorage.getItem(localStorageLayoutKey);

    const widgetArray = localWidgets && JSON.parse(localWidgets);

    const newWidgets = localWidgets ? widgetArray.reduce((object: Widgets, key: WidgetType) => ({
        ...object,
        [key]: defaultWidgetMap[key],
    }), {}) : widgets;
    const newLayouts = localLayouts ? JSON.parse(localLayouts) : layouts;

    return {
        widgets: newWidgets,
        layouts: newLayouts,
    };
};

export const setLocalWidgets = (widgets: Widgets, layouts: Layouts) => {
    const widgetArray = Object.keys(widgets).map(key => key);
    localStorage.setItem(localStorageWidgetKey, JSON.stringify(widgetArray));
    localStorage.setItem(localStorageLayoutKey, JSON.stringify(layouts));
};

export const deleteLocalWidgets = () => {
    localStorage.removeItem(localStorageWidgetKey);
    localStorage.removeItem(localStorageLayoutKey);
};
