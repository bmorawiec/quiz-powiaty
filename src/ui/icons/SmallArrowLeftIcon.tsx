import type { IconProps } from "./props";

export function SmallArrowLeftIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7.43457 1.83502C7.74699 1.5226 8.25301 1.5226 8.56543 1.83502C8.87764 2.14746 8.87778 2.65353 8.56543 2.96588L4.33203 7.20026H13.5996C14.0414 7.20026 14.3994 7.55823 14.3994 8.00006C14.3994 8.44186 14.0414 8.79987 13.5996 8.79987H4.33203L8.56543 13.0352C8.87754 13.3477 8.87775 13.8538 8.56543 14.1661C8.25309 14.4781 7.74691 14.4781 7.43457 14.1661L1.26855 8.00006L7.43457 1.83502Z"/>
        </svg>
    );
}
