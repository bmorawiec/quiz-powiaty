import { Button, CloseIcon, Dialog, DialogRoot, RestartIcon, WarningIcon } from "src/ui";

export interface ConfirmRestartDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmRestartDialog({ onConfirm, onCancel }: ConfirmRestartDialogProps) {
    return (
        <DialogRoot onScrimPointerDown={onCancel}>
            <Dialog className="w-[500px]">
                <div className="flex px-[25px] pt-[30px] pb-[20px] gap-[7px]">
                    <WarningIcon className="mt-[2px]"/>
                    <p>
                        Ta czynność spowoduje zrestartowanie gry.
                    </p>
                </div>
                <div className="flex justify-end gap-[10px] p-[20px] border-t border-gray-20 dark:border-gray-80">
                    <Button
                        icon={CloseIcon}
                        text="Anuluj"
                        onClick={onCancel}
                    />
                    <Button
                        icon={RestartIcon}
                        text="Restartuj"
                        filled
                        onClick={onConfirm}
                    />
                </div>
            </Dialog>
        </DialogRoot>
    );
}
