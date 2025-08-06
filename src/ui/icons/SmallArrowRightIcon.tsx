import type { IconProps } from "./props";

export function SmallArrowRightIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7.43457 1.83502C7.74699 1.5226 8.25301 1.5226 8.56543 1.83502L14.7314 8.00006L8.56543 14.1661C8.25309 14.4781 7.74691 14.4781 7.43457 14.1661C7.12225 13.8538 7.12246 13.3477 7.43457 13.0352L11.668 8.79987H2.40039C1.95858 8.79987 1.60062 8.44186 1.60059 8.00006C1.60059 7.55823 1.95856 7.20026 2.40039 7.20026H11.668L7.43457 2.96588C7.12222 2.65353 7.12236 2.14746 7.43457 1.83502Z"/>
        </svg>
    );
}
