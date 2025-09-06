import type { ReactNode } from "react";

export interface DrawerProps {
    collapsedHeight: number;
    children?: ReactNode;
}

export function Drawer({ collapsedHeight, children }: DrawerProps) {
    return (
        <div className="fixed left-0 top-0 w-full pr-[100px] box-content h-full pointer-events-none
            overflow-x-hidden overflow-y-auto">
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
