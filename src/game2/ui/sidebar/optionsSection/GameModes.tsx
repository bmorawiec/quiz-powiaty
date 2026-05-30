import { validModes, type GameMode, type GameOptions } from "src/game2/options";
import { RadioButton } from "src/ui";

export interface GameModesProps {
    options: GameOptions;
    onChange: (newOptions: GameOptions) => void;
}

const LABELS: Record<GameMode, string> = {
    choiceGame: "Wybierz",
    dndGame: "Przyporządkuj",
    promptGame: "Zgadnij",
    typingGame: "Podpisz",
};

export function GameModes({ options, onChange }: GameModesProps) {
    const switchModes = (mode: GameMode) => {
        if (mode !== options.mode) {
            onChange({
                ...options,
                mode,
            });
        }
    };

    const otherModes = validModes(options.guessFrom, options.guess);
    return (
        <div className="flex flex-col mx-[-12px] mt-[12px]">
            {otherModes.map((mode) =>
                <RadioButton
                    key={mode}
                    label={LABELS[mode]}
                    checked={options.mode === mode}
                    onClick={() => switchModes(mode)}
                />
            )}
        </div>
    );
}
