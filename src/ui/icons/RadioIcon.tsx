import type { IconProps } from "./props";

export function RadioIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 1.59961C4.46538 1.59961 1.59961 4.46538 1.59961 8C1.59961 11.5346 4.46538 14.4004 8 14.4004C11.5346 14.4004 14.4004 11.5346 14.4004 8C14.4004 4.46538 11.5346 1.59961 8 1.59961Z"/>
        </svg>
    );
}
