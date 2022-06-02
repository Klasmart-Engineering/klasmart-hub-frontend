import Toolbar from "@/components/Core/AppBar/Toolbar";
import SideNavigationDrawer from "@/components/Core/SideNavigation/Drawer";
import Router from "@/router";
import { sideNavigationDrawerOpenState } from "@/store/site";
import { useSetGlobalState } from "@kl-engineering/frontend-state";
import { useWidth } from "@kl-engineering/kidsloop-px";
import { Stack } from "@mui/material";
import {
    useEffect,
    useState,
} from "react";

export const MOBILE_WIDTHS = [ `xs`, `sm` ];

interface Props {
}

export default function BaseLayout (props: Props) {
    const setNavigationDrawerOpen = useSetGlobalState(sideNavigationDrawerOpenState);
    const width = useWidth();
    const [ windowWidth, setWindowWidth ] = useState(width);

    useEffect(() => {
        if (MOBILE_WIDTHS.includes(width) === MOBILE_WIDTHS.includes(windowWidth)) {
            setWindowWidth(width);
            return;
        }
        setWindowWidth(width);
        setNavigationDrawerOpen(!MOBILE_WIDTHS.includes(width));
    }, [
        width,
        windowWidth,
        setNavigationDrawerOpen,
    ]);

    const toolbarHeight = 50 + 1; // height + appbar bottom border

    return (
        <>
            <Toolbar />
            <Stack
                direction="row"
                flex="1"
                height={`calc(100% - ${toolbarHeight}px)`}
            >
                <SideNavigationDrawer />
                <main
                    style={{
                        overflowY: `auto`,
                        flex: 1,
                    }}
                >
                    <Router />
                </main>
            </Stack>
        </>
    );
}
