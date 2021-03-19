import {
    useCallback,
    useLayoutEffect,
    useState,
} from "react";

export interface BoundingRect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}

function getRect<T extends HTMLElement> (element?: T): BoundingRect {
    let rect: BoundingRect = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
    };
    if (element) rect = element.getBoundingClientRect();
    return rect;
}

export function useRect<T extends HTMLElement> (ref: React.RefObject<T>): BoundingRect {
    const [ rect, setRect ] = useState<BoundingRect>(ref && ref.current ? getRect(ref.current) : getRect());

    const handleResize = useCallback(() => {
        if (!ref.current) return;
        setRect(getRect(ref.current));
    }, [ ref ]);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        handleResize();

        if (typeof ResizeObserver === `function`) {
            const resizeObserver = new ResizeObserver(() => handleResize());
            resizeObserver.observe(element);
            return () => {
                if (!resizeObserver) return;
                resizeObserver.disconnect();
            };
        } else {
            window.addEventListener(`resize`, handleResize); // Browser support, remove freely
            return () => window.removeEventListener(`resize`, handleResize);
        }
    }, [ ref.current ]);

    return rect;
}
