import { WidgetType } from "../../models/widget.model";
import getLayouts, {
    Layout,
    Layouts,
    Widgets,
    WidgetView,
} from "../defaultWidgets";
import _ from "lodash";

export const removeSingleWidget = (widgetId: WidgetType, widgets: Widgets, layouts: Layouts, view: WidgetView) => {
    let layout = layouts.md;
    delete widgets[widgetId];
    layout = layout.filter(l => l.i !== widgetId);
    return {
        widgets,
        layouts: updateWidgetOrders(layout, view),
    };
};

export const addSingleWidget = (widgetId: WidgetType, widgets: Widgets, layouts: Layouts, view: WidgetView) => {
    let { md } = layouts;
    md = md.filter(l => Object.keys(widgets).find(w => w === l.i));
    const { layouts: { md: defaultMdLayout }, widgets: defaultWidgetMap } = getLayouts(view);
    const layoutArray = Array.from(defaultMdLayout);
    const widget = layoutArray.find(({ i }: { i: WidgetType }) => i === widgetId);
    let newLayout: Layout[] = [];
    if(widget) {
        newLayout = [
            ...md,
            ...[
                {
                    ...widget,
                    x: 100,
                    y: 100,
                },
            ],
        ];
    }
    const newWidgets = {
        ...widgets,
        [widgetId]: defaultWidgetMap[widgetId],
    };

    return {
        widgets: newWidgets,
        layouts: updateWidgetOrders(newLayout, view),
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

const nextSpace = (cx: number, cy: number, w: number) => {
    return (cx + w > 12) ? {
        x: 0,
        y: cy + 1,
    } : {
        x: cx + 1,
        y: cy,
    };
};
/* eslint-enable */

const createLayout = (newLayout: Layout[], sizeLayout: Layout[]) => {
    let cx = -1;
    let cy = 0;
    return newLayout.reduce((prev: Layout[], cur: { i: any; w: number; h: any }, i: any) => {
        cur = sizeLayout.find((layout: { i: any }) => layout.i === cur.i) || cur;
        let overLaping = true;
        const previous = prev.slice(0, i);
        do {
            const space = nextSpace(cx, cy, cur.w);
            cx = space.x;
            cy = space.y;
            overLaping = !!previous.find((p: any) => {
                const px = p.x;
                const py = p.y;
                const pxi = p.x + p.w - 1;
                const pyi = p.y + p.h - 1;
                const cxi = cx + cur.w - 1;
                const cyi = cy + cur.h - 1;
                return (((px <= cx && cx <= pxi) && (py <= cy && cy <= pyi)) || ((px <= cxi && cxi <= pxi) && (py <= cyi && cyi <= pyi)));
            });
        } while (overLaping);
        return [
            ...prev,
            ...[
                {
                    ...cur,
                    x: cx,
                    y: cy,
                },
            ],
        ];
    }, []);
};

export const updateWidgetOrders = (layout: Layout[], view: WidgetView) => {
    const { layouts } = getLayouts(view);
    const defaultLayouts = {
        ...layouts,
    };
    const {
        lg: defaultLgLayout,
        md: defaultMdLayout,
        sm: defaultSmLayout,
    } = defaultLayouts;

    // Filters removed widgets from original layouts
    let newLgLayout = filterLayout(layout, defaultLgLayout);
    let newMdLayout = filterLayout(layout, defaultMdLayout);
    let newSmLayout = filterLayout(layout, defaultSmLayout);

    // Orders new layout based on widget position
    const newLayout = orderWidgetsArray(Array.from(layout));
    newLgLayout = createLayout(newLayout, newLgLayout);
    newMdLayout = createLayout(newLayout, newMdLayout);
    newSmLayout = createLayout(newLayout, newSmLayout);
    return {
        lg: newLgLayout,
        md: newMdLayout,
        sm: newSmLayout,
    };
};

export const getAvailableWidgets = (widgets: Widgets, view: WidgetView) => {

    const { widgets: defaultWidgetMap } = getLayouts(view);

    const availableWidgets = {
        ...defaultWidgetMap,
    };
    const widgetIds = Object.keys(widgets).map(key => key);
    widgetIds.forEach(id => {
        delete availableWidgets[id];
    });
    return availableWidgets;
};
