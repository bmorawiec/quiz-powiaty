import type { ReactNode } from "react";

export interface StepperProps {
    children: ReactNode;
}

export function Stepper({ children }: StepperProps) {
    return (
        <div className="h-[30px] flex items-center">
            {children}
        </div>
    );
}
