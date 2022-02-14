import { Layout } from "./widgetCustomisation/defaultWidgets";
import WidgetContext from "./widgetCustomisation/widgetContext";
import { styled } from "@mui/material";
import React,
{
    useContext,
    useEffect,
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
    isDraggable: boolean;
}

export default function WidgetGrid (props: Props) {
    const [ layoutArray, setLayoutArray ] = useState<Layout[]>([] as Layout[]);
    const [ breakpoint, setBreakpoint ] = useState<string>(`lg`);
    const {
        widgets,
        loadWidgets,
        reorderWidgets,
        layouts,
        editing,
    } = useContext(WidgetContext);

    useEffect(() => {
        loadWidgets();
        setLayoutArray(layouts[breakpoint]);
    }, [ editing ]);

    useEffect(() => {
        // dispatch resize everytime the grid updates
        window.dispatchEvent(new Event(`resize`));
    });

    const { isDraggable } = props;

    const responsiveProps: ResponsiveProps = {
        autoSize: true,
        isResizable: false,
        margin: [ 15, 15 ],
        rowHeight: 100,
        isDraggable: isDraggable,
        isBounded: true,
        onBreakpointChange:(newBreakpoint: string) => {
            setBreakpoint(newBreakpoint);
        },
        onLayoutChange: () => {
            setLayoutArray(layouts[breakpoint]);
        },
        onDragStop (layout: Layout[]) {
            reorderWidgets(layout);
        },
    };

    return (
        layouts.lg.length > 0 ? <ResponsiveGridLayout
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
            {
                layoutArray.map((layout:Layout) => {
                    return <div key={layout.i}>{widgets[layout.i]}</div>;
                })
            }
        </ResponsiveGridLayout> : !editing &&
            <div>There are currently no widgets added to the dashboard, please use the Customize button to add some widgets</div>
    );
}
