import {
    Layout,
    WidgetView,
} from "./defaultWidgets";
import immutableStateUpdate from "./widgetCustomisation/immutableStateUpdate";
import WidgetContext from "./widgetCustomisation/widgetContext";
import { State } from "@/components/Dashboard/WidgetDashboard";
import { styled } from "@mui/material";
import React,
{
    useContext,
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
    const [ state, setState ] = useState<State>({} as State);

    const {
        widgets: contextWidgets,
        layouts: contextLayouts,
        editing,
        reorderWidgets,
        cancelEditing,
    } = useContext(WidgetContext);
    const { view } = props;

    useEffect(() => {
        setLayoutArray(contextLayouts[breakpoint]);
        immutableStateUpdate(setState, contextWidgets, contextLayouts);
    }, [ view, editing ]);

    useEffect(() => {
        setLayoutArray(contextLayouts[breakpoint]);
    }, [ contextLayouts ]);

    useEffect(() => {
        immutableStateUpdate(setState, contextWidgets, contextLayouts);
    }, [ contextWidgets, contextLayouts ]);

    useEffect(() => {
        reorderWidgets(contextLayouts[breakpoint]);
    }, [ editing ]);

    useEffect(() => {
        // dispatch resize everytime the grid updates
        window.dispatchEvent(new Event(`resize`));
    });

    const responsiveProps: ResponsiveProps = {
        autoSize: true,
        isResizable: false,
        margin: [ 15, 15 ],
        rowHeight: 100,
        isDraggable: editing,
        isBounded: true,
        onBreakpointChange:(newBreakpoint: string) => {
            setBreakpoint(newBreakpoint);
            if(newBreakpoint === `sm` && editing) { cancelEditing();}
        },
        onLayoutChange: () => {
            setLayoutArray(state.layouts[breakpoint]);
        },
        onDragStop: (newItem) => {
            reorderWidgets(newItem as Layout[]);
        },
    };

    const widgetArray = useMemo(() => {
        return layoutArray && layoutArray.map((layout:Layout) => {
            return <div key={layout.i}>{state.widgets[layout.i]}</div>;
        });
    }, [ view, layoutArray ]);

    return <ResponsiveGridLayout
        className="layout"
        layouts={state.layouts}
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
