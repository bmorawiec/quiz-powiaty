import type { ReactNode } from "react";
import { LargeButton, LargeLink, RestartIcon } from "src/ui";

export interface FinishedViewBaseProps {
    onRestart?: () => void;
    children?: ReactNode;
}

export function FinishedViewBase({ onRestart, children }: FinishedViewBaseProps) {
    return (
        <div className="flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col">
            <div className="flex-1 overflow-y-auto pt-[58px] flex flex-col items-center">
                <div className="w-full max-w-[740px] flex flex-col gap-[22px] px-[20px]">
                    <h2 className="text-[30px] text-gray-90 dark:text-gray-15 self-center">
                        Twój wynik
                    </h2>

                    {children}
                </div>
            </div>

            <div className="w-full max-w-[740px] px-[20px] self-center grid xs:grid-cols-2 max-xs:grid-rows-2
                gap-[10px] pb-[50px]">
                <LargeButton
                    primary
                    text="Zagraj od nowa"
                    icon={RestartIcon}
                    onClick={onRestart}
                />
                <LargeLink
                    to="/"
                    text="Inny tryb gry"
                />
            </div>
        </div>
    );
}
