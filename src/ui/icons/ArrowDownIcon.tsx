import type { IconProps } from "./props";

export function ArrowDownIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M14.9655 7.43457C15.2778 7.74696 15.2778 8.25301 14.9655 8.56543L7.99963 15.5312L1.03479 8.56543C0.72237 8.25301 0.72237 7.74699 1.03479 7.43457C1.34723 7.12234 1.85329 7.12221 2.16565 7.43457L7.19983 12.4668V1.59961C7.20003 1.15803 7.55804 0.799936 7.99963 0.799805C8.44134 0.799805 8.79924 1.15795 8.79944 1.59961V12.4688L13.8346 7.43457C14.147 7.12224 14.6531 7.12218 14.9655 7.43457Z"/>
        </svg>
    );
}
