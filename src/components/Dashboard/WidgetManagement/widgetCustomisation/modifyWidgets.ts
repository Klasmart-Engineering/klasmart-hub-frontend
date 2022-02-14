import { WidgetType } from "../../models/widget.model";
import {
    defaultLgLayout,
    defaultMdLayout,
    defaultSmLayout,
    defaultWidgetMap,
    Layout,
    Layouts,
    Widgets,
} from "./defaultWidgets";
import _ from "lodash";

const findWidgetLayoutPosition = (layout: Layout[], widgetId: WidgetType) => {
    const layoutArray = Array.from(layout);
    const found = layoutArray.find(({ i } : {i: WidgetType}) => i === widgetId);
    return found ? found : false;
};

export const removeSingleWidget = (widgetId: WidgetType, widgets: Widgets, layouts: Layouts) => {
    const {
        lg,
        md,
        sm,
    } = layouts;

    const newWidgets = _.omit(widgets, widgetId);
    const newLgLayout = Array.from(lg);
    const newMdLayout = Array.from(md);
    const newSmLayout = Array.from(sm);

    const lgWidgetLayoutPosition = findWidgetLayoutPosition(lg, widgetId);
    const mdWidgetLayoutPosition = findWidgetLayoutPosition(md, widgetId);
    const smWidgetLayoutPosition = findWidgetLayoutPosition(sm, widgetId);

    delete newWidgets[widgetId];

    lgWidgetLayoutPosition && newLgLayout.splice(newLgLayout.indexOf(lgWidgetLayoutPosition), 1);
    mdWidgetLayoutPosition && newMdLayout.splice(newMdLayout.indexOf(mdWidgetLayoutPosition), 1);
    smWidgetLayoutPosition && newSmLayout.splice(newSmLayout.indexOf(smWidgetLayoutPosition), 1);

    return {
        widgets: newWidgets,
        layouts: updateWidgetOrders(newLgLayout),
    };
};

export const addSingleWidget = (widgetId: WidgetType, widgets: Widgets, layouts: Layouts) => {
    const {
        lg,
        md,
        sm,
    } = layouts;

    const newWidgets = Object.assign({}, widgets);
    const newLgLayout = Array.from(lg);
    const newMdLayout = Array.from(md);
    const newSmLayout = Array.from(sm);

    const defaultLgLayoutCopy = Array.from(defaultLgLayout);
    const defaultMdLayoutCopy = Array.from(defaultMdLayout);
    const defaultSmLayoutCopy = Array.from(defaultSmLayout);

    const lgWidgetLayoutPosition = findWidgetLayoutPosition(defaultLgLayoutCopy, widgetId);
    const mdWidgetLayoutPosition = findWidgetLayoutPosition(defaultMdLayoutCopy, widgetId);
    const smWidgetLayoutPosition = findWidgetLayoutPosition(defaultSmLayoutCopy, widgetId);

    !newWidgets[widgetId] && (newWidgets[widgetId] = defaultWidgetMap[widgetId]);
    lgWidgetLayoutPosition && !newLgLayout.includes(lgWidgetLayoutPosition) && newLgLayout.push(lgWidgetLayoutPosition);
    mdWidgetLayoutPosition && !newMdLayout.includes(mdWidgetLayoutPosition) && newMdLayout.push(mdWidgetLayoutPosition);
    smWidgetLayoutPosition && !newSmLayout.includes(smWidgetLayoutPosition) && newSmLayout.push(smWidgetLayoutPosition);

    return {
        widgets: newWidgets,
        layouts: updateWidgetOrders(newLgLayout),
    };
};

export const orderWidgetsArray = (layout: Layout[]) => {
    const newLayout = layout
        .sort((a: Layout, b: Layout) => {
            if (a.y === b.y) {
                return a.x - b.x;
            }
            return a.y - b.y;
        });
    return newLayout;
};

const filterLayout = (layoutToMatch: Layout[], originalLayout: Layout[]) => {
    const filteredLayout = originalLayout.filter(layout => layoutToMatch.map(order => order.i).includes(layout.i));
    return filteredLayout;
};

export const updateWidgetOrders = (layout: Layout[]) => {

    const defaultLgLayoutCopy = Array.from(defaultLgLayout);
    const defaultMdLayoutCopy = Array.from(defaultMdLayout);
    const defaultSmLayoutCopy = Array.from(defaultSmLayout);

    // Filters removed widgets from original layouts
    const newLgLayout = filterLayout(layout, defaultLgLayoutCopy);
    const newMdLayout = filterLayout(layout, defaultMdLayoutCopy);
    const newSmLayout = filterLayout(layout, defaultSmLayoutCopy);

    // Orders new layout based on widget position
    const newLayout = orderWidgetsArray(Array.from(layout));

    // Checks for schedule widget
    const scheduleWidget = findWidgetLayoutPosition(newLayout, WidgetType.SCHEDULE);

    // Removes schedule from widget array to avoid ordering issues
    let scheduleWidgetY = 0;
    if(scheduleWidget){
        scheduleWidgetY = scheduleWidget.y;
        newLayout.splice(newLayout.indexOf(scheduleWidget), 1);
    }

    newLayout.forEach((layout, orderedIndex) => {
        const { i } = layout;

        newLgLayout.forEach((widget) => {
            // Overwrite if full width widget
            if(widget.w === 12) {
                widget.y = scheduleWidgetY;
                widget.x = 0;
            }

            if(widget.i === i) {
                // Widgets are arranged in sets of 3 per Y (row) - the result will be 0, 0, 0, 4, 4, 4, 8, 8, 8 etc
                widget.y  = (Math.floor((orderedIndex + 1) / 4) * 4);
                // Widgets are arranged from left to right per row - the result will be 0, 4, 8, 0, 4, 8, 0, 4, 8 etc
                widget.x = ((orderedIndex + 1) % 3 === 0 ? 8 : (orderedIndex + 2) % 3 === 0 ? 4 : 0);
            }
        });

        newMdLayout.forEach((widget) => {
            // Overwrite if full width widget
            if(widget.w === 12) {
                widget.y = scheduleWidgetY;
                widget.x = 0;
            }

            if(widget.i === i) {
                // Widgets are arranged in sets of 2 per Y (row) - the result will be 0, 0, 4, 4, 8, 8 etc
                widget.y = (Math.floor((orderedIndex) / 2) * 4);
                // Widgets are arranged from left to right per row - the result will be 0, 6, 0, 6, 0, 6 etc
                widget.x = ((orderedIndex + 1) % 2 === 0 ? 6 : 0);
            }
        });

        newSmLayout.forEach((widget) => {
            if(widget.i === i) {
                widget.x = 0;
                widget.y = orderedIndex * 4;
            }
        });
    });

    return {
        lg: newLgLayout,
        md: newMdLayout,
        sm: newSmLayout,
    };
};

export const getAvailableWidgets = (widgets: Widgets) => {
    const availableWidgets = Object.assign({}, defaultWidgetMap);
    const widgetIds = Object.keys(widgets).map(key => key);
    widgetIds.forEach(id => {
        delete availableWidgets[id];
    });
    return availableWidgets;
};
