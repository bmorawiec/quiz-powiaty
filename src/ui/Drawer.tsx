import { useRef, type ReactNode } from "react";

export interface DrawerProps {
    collapsedHeight: number;
    children?: ReactNode;
}

const THRESHOLD = 100;

export function Drawer({ collapsedHeight, children }: DrawerProps) {
    const root = useRef<HTMLDivElement | null>(null);

    const isProgramaticScroll = useRef(false);
    const expanded = useRef(false);
    const setExpanded = (newExpanded: boolean) => {
        const elem = root.current!;
        const maxScrollTop = window.innerHeight - collapsedHeight;

        expanded.current = newExpanded;
        elem.scrollTop = (newExpanded) ? maxScrollTop : 0;

        isProgramaticScroll.current = true;
    };

    const handleScrollEnd = () => {
        if (isProgramaticScroll.current) {
            isProgramaticScroll.current = false;
            return;
        }

        const elem = root.current!;
        const maxScrollTop = window.innerHeight - collapsedHeight;
        if (expanded.current) {
            if (elem.scrollTop < maxScrollTop) {
                const shouldBeExpanded = elem.scrollTop > maxScrollTop - THRESHOLD;
                setExpanded(shouldBeExpanded);
            }
        } else {
            if (elem.scrollTop > 0) {
                const shouldBeExpanded = elem.scrollTop > THRESHOLD;
                setExpanded(shouldBeExpanded);
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
