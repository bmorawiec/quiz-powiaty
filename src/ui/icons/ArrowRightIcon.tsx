import type { IconProps } from "./props";

export function ArrowRightIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7.43457 1.03442C7.74696 0.722066 8.25301 0.722107 8.56543 1.03442L15.5312 8.00024L8.56543 14.9651C8.25301 15.2775 7.74699 15.2775 7.43457 14.9651C7.12234 14.6527 7.12221 14.1466 7.43457 13.8342L12.4668 8.80005H1.59961C1.15803 8.79985 0.799936 8.44184 0.799805 8.00024C0.799805 7.55854 1.15795 7.20064 1.59961 7.20044H12.4688L7.43457 2.16528C7.12224 1.85286 7.12218 1.34681 7.43457 1.03442Z"/>
        </svg>
    );
}
