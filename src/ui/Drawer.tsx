import { useEffect, useRef, type ReactNode } from "react";

export interface DrawerProps {
    expanded: boolean;
    onExpandedChange: (newExpanded: boolean) => void;
    collapsedHeight: number;
    children?: ReactNode;
}

// the distance (in pixels) the drawer has to be moved from the expanded/collapsed position
// so that it collapses/expands
const THRESHOLD = 100;

export function Drawer({ expanded, onExpandedChange, collapsedHeight, children }: DrawerProps) {
    const root = useRef<HTMLDivElement | null>(null);

    // true if the next scrollend event to be triggered will be caused by a programmatic scroll
    // false if the next scrollend event to be triggered will be caused by the user
    const isProgramaticScroll = useRef(false);
    useEffect(() => {
        const elem = root.current!;
        const maxScrollTop = window.innerHeight - collapsedHeight;

        elem.scrollTop = (expanded) ? maxScrollTop : 0;

        isProgramaticScroll.current = true;
    }, [expanded, collapsedHeight]);

    const handleScrollEnd = () => {
        if (isProgramaticScroll.current) {
            isProgramaticScroll.current = false;
            return;
        }

        const elem = root.current!;
        const maxScrollTop = window.innerHeight - collapsedHeight;
        if (expanded) {
            if (elem.scrollTop < maxScrollTop) {
                const shouldBeExpanded = elem.scrollTop > maxScrollTop - THRESHOLD;
                onExpandedChange(shouldBeExpanded);
            }
        } else {
            if (elem.scrollTop > 0) {
                const shouldBeExpanded = elem.scrollTop > THRESHOLD;
                onExpandedChange(shouldBeExpanded);
            }
        }
    };

    return (
        <div
            ref={root}
            className="fixed left-0 top-0 w-full pr-[100px] box-content h-full pointer-events-none
                overflow-x-hidden overflow-y-auto scroll-smooth"
            onScrollEnd={handleScrollEnd}
        >
            <div
                className="absolute top-[100%] w-[100vw] h-full pointer-events-auto
                    bg-white dark:bg-gray-95 rounded-t-[20px] shadow-sm shadow-black/10 flex flex-col"
                style={{
                    marginTop: -collapsedHeight + "px"
                }}
            >
                <div className="absolute left-[50%] top-[10px] w-[50px] ml-[-25px] h-[6px] bg-gray-10 rounded-full"/>
                {children}
            </div>
        </div>
    );
}
