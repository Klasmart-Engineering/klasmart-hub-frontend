import getLayouts, {
    Layout,
    Layouts,
    Widgets,
    WidgetView,
} from "./defaultWidgets";
import { styled } from "@mui/material";
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Responsive,
    ResponsiveProps,
    WidthProvider,
} from 'react-grid-layout';

const GridStyleOverride = styled(Responsive)<{ component?: React.ElementType }>({
    '& .react-grid-item.react-grid-placeholder': {
        backgroundColor: `rgba(255,255,255,0.9)`,
        borderRadius: 20,
    },
});

const ResponsiveGridLayout = WidthProvider(GridStyleOverride);

interface Props {
    view: WidgetView;
}

export default function WidgetGrid (props: Props) {
    const [ layoutArray, setLayoutArray ] = useState<Layout[]>([] as Layout[]);
    const [ breakpoint, setBreakpoint ] = useState<string>(`lg`);
    const [ layouts, setLayouts ] = useState<Layouts>({} as Layouts);
    const [ widgets, setWidgets ] = useState<Widgets>({} as Widgets);
    const { view } = props;

    useEffect(() => {
        const { layouts: initialLayout, widgets: initialWidget } = getLayouts(view);
        setLayouts(initialLayout);
        setWidgets(initialWidget);
        setLayoutArray(initialLayout[breakpoint]);
    }, [ view ]);

    useEffect(() => {
        // dispatch resize everytime the grid updates
        window.dispatchEvent(new Event(`resize`));
    });

    const responsiveProps: ResponsiveProps = {
        autoSize: true,
        isResizable: false,
        margin: [ 15, 15 ],
        rowHeight: 100,
        isDraggable: false,
        isBounded: true,
        onBreakpointChange:(newBreakpoint: string) => {
            setBreakpoint(newBreakpoint);
        },
        onLayoutChange: () => {
            setLayoutArray(layouts[breakpoint]);
        },
    };

    const widgetArray = useMemo(() => {
        return layoutArray && layoutArray.map((layout:Layout) => {
            return <div key={layout.i}>{widgets[layout.i]}</div>;
        });
    }, [ view, layoutArray ]);

    return <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        {...responsiveProps}
        breakpoints={{
            lg: 1200,
            md: 768,
            sm: 480,
        }}
        cols={{
            lg: 12,
            md: 12,
            sm: 12,
        }}>
        {widgetArray}
    </ResponsiveGridLayout>;
}
