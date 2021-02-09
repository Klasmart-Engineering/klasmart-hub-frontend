import KidsLoopIcon from "@/assets/img/kidsloop_icon.svg";

export const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackImageUrl?: string) => {
    event.currentTarget.src = fallbackImageUrl ?? KidsLoopIcon;
};
