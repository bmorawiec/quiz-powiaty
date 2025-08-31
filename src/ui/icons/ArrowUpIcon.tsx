import type { IconProps } from "./props";

export function ArrowUpIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M14.9655 8.89648C15.2778 8.58409 15.2778 8.07804 14.9655 7.76562L7.99963 0.799805L1.03479 7.76562C0.72237 8.07804 0.72237 8.58406 1.03479 8.89648C1.34723 9.20871 1.85329 9.20884 2.16565 8.89648L7.19983 3.86426V14.7314C7.20003 15.173 7.55804 15.5311 7.99963 15.5312C8.44134 15.5312 8.79924 15.1731 8.79944 14.7314V3.8623L13.8346 8.89648C14.147 9.20881 14.6531 9.20887 14.9655 8.89648Z"/>
        </svg>
    );
}
