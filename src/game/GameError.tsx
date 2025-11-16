import { CloseIcon, LargeLink, SmallArrowLeftIcon } from "src/ui";

export interface GameErrorProps {
    title: string;
    details: string;
}

export function GameError({ title, details }: GameErrorProps) {
    return (
        <div className="size-full sm:px-[20px] lg:px-[100px] sm:pb-[38px] min-h-[600px]">
            <div className="size-full sm:rounded-[20px] bg-gray-5 dark:bg-gray-95
                flex items-center justify-center px-[40px]">
                <div className="w-full max-w-[800px] flex flex-col gap-[6px] pt-[48px]
                    text-red-70 dark:text-red-40">
                    <div className="flex items-center gap-[8px]">
                        <CloseIcon className="size-[24px] shrink-0"/>
                        <h2 className="text-[28px]">
                            {title}
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
        </div>
    );
}
