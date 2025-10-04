import { SpinnerIcon } from "src/ui";

export function LoadingPopup() {
    return (
        <div className="absolute left-0 top-0 size-full flex items-center justify-center
            bg-black/10 animate-slow-delayed-fade-in">
            <div className="px-[30px] h-[60px] flex items-center gap-[10px] rounded-[10px]
                bg-white dark:bg-black">
                <SpinnerIcon className="text-teal-70 animate-spin"/>
                <p>Ładowanie...</p>
            </div>
        </div>
    );
}
