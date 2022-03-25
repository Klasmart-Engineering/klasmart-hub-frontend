import { WidgetType } from "../../models/widget.model";
import getLayouts, {
    Layouts,
    Widgets,
    WidgetView,
} from "../defaultWidgets";

const localStorageWidgetKey = `kl_widgets`;
const localStorageLayoutKey = `kl_layouts`;

export const getLocalWidgets = (storageId: string, view: WidgetView) => {
    const localWidgets = localStorage.getItem(`${localStorageWidgetKey}_${storageId}`);
    const localLayouts = localStorage.getItem(`${localStorageLayoutKey}_${storageId}`);

    const { widgets: defaultWidgets, layouts: defaultLayouts } = getLayouts(view);

    const widgets = {
        ...defaultWidgets,
    };
    const layouts = {
        ...defaultLayouts,
    };

    const widgetArray = localWidgets && JSON.parse(localWidgets);

    const newWidgets = localWidgets ? widgetArray.reduce((object: Widgets, key: WidgetType) => ({
        ...object,
        [key]: widgets[key],
    }), {}) : widgets;
    const newLayouts = localLayouts ? JSON.parse(localLayouts) : layouts;

    // save to localstorage what we return
    setLocalWidgets(newWidgets, newLayouts, storageId);

    return {
        widgets: newWidgets,
        layouts: newLayouts,
    };
};

export const setLocalWidgets = (widgets: Widgets, layouts: Layouts, storageId: string) => {
    const widgetArray = Object.keys(widgets).map(key => key);
    localStorage.setItem(`${localStorageWidgetKey}_${storageId}`, JSON.stringify(widgetArray));
    localStorage.setItem(`${localStorageLayoutKey}_${storageId}`, JSON.stringify(layouts));
};

export const deleteLocalWidgets = (storageId: string) => {
    localStorage.removeItem(`${localStorageWidgetKey}_${storageId}`);
    localStorage.removeItem(`${localStorageLayoutKey}_${storageId}`);
};
