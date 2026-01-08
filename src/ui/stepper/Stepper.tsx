import type { ReactNode } from "react";

export interface StepperProps {
    children: ReactNode;
}

export function Stepper({ children }: StepperProps) {
    return (
        <div className="flex items-center overflow-x-auto scrollbar-hidden p-[20px] m-[-20px]">
            {children}
        </div>
    );
}
