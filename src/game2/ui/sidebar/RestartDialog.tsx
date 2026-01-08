import { Button, CloseIcon, Dialog, DialogRoot, RestartIcon, WarningIcon } from "src/ui";

export interface RestartDialogProps {
    /** Called when the user clicks the 'confirm' button. */
    onConfirm: () => void;
    /** Called when the user closes the dialog by clicking outside of it, or clicks the 'cancel' or 'confirm'
     *  buttons. */
    onClose: () => void;
}

/** Shows a game restart confirmation dialog. */
export function RestartDialog({ onConfirm, onClose }: RestartDialogProps) {
    const handleRestartClick = () => {
        onConfirm();
        onClose();
    };

    return (
        <DialogRoot onScrimPointerDown={onClose}>
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
                        onClick={onClose}
                    />
                    <Button
                        icon={RestartIcon}
                        text="Restartuj"
                        filled
                        onClick={handleRestartClick}
                    />
                </div>
            </Dialog>
        </DialogRoot>
    );
}
