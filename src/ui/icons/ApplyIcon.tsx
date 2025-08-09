import type { IconProps } from "./props";

export function ApplyIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M14.6339 3.43457C14.9463 3.12215 15.4533 3.12215 15.7658 3.43457C16.0779 3.74694 16.0779 4.25306 15.7658 4.56543L6.39955 13.9316L0.23451 7.76563C-0.077877 7.45324 -0.0778119 6.94719 0.23451 6.63477C0.546929 6.32235 1.05295 6.32235 1.36537 6.63477L6.39955 11.668L14.6339 3.43457Z"/>
        </svg>
    );
}
