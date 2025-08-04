import type { IconProps } from './props';

export function DropdownIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M13.0347 5.03455C13.3472 4.72222 13.8532 4.72216 14.1656 5.03455C14.4779 5.34694 14.4779 5.85301 14.1656 6.16541L7.99957 12.3314L1.83453 6.16541C1.52211 5.85299 1.52211 5.34697 1.83453 5.03455C2.14695 4.72213 2.65297 4.72213 2.96539 5.03455L7.99957 10.0677L13.0347 5.03455Z"/>
        </svg>
    );
}
