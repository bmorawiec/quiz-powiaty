import { CloseIcon, LargeLink, SmallArrowLeftIcon } from "src/ui";

export interface GameErrorProps {
    details: string;
}

export function GameError({ details }: GameErrorProps) {
    return (
        <div className="size-full bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex items-center justify-center
            px-[40px]">
            <div className="w-full max-w-[800px] flex flex-col gap-[6px] text-red-70 dark:text-red-40 pt-[48px]">
                <div className="flex items-center gap-[8px]">
                    <CloseIcon className="size-[24px]"/>
                    <h2 className="text-[28px]">
                        Coś poszło nie tak...
                    </h2>
                </div>
                <p className="text-[20px]">
                    {details}
                </p>

                <LargeLink
                    to="/"
                    error
                    text="Wróć do strony głównej"
                    icon={SmallArrowLeftIcon}
                    className="mt-[40px] self-start"
                />
            </div>
        </div>
    );
}
