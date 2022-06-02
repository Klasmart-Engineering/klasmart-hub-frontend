import {
    useMediaQuery,
    useTheme,
} from "@mui/material";

export const useIsMobileScreen = () => {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.only(`xs`));
    return isSmDown;
};

export const useIsTabletScreen = () => {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.only(`sm`));
    return isSmDown;
};

export const useIsMobileTabletScreen = () => {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`md`));
    return isSmDown;
};

export const useIsDesktopScreen = () => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));
    return isMdUp;
};
