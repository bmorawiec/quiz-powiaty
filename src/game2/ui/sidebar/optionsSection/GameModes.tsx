import { gameTypesFromCombo, type GameOptions, type GameType } from "src/gameOptions";
import { RadioButton } from "src/ui";

export interface GameModesProps {
    options: GameOptions;
    onChange: (newOptions: GameOptions) => void;
}

const LABELS: Record<GameType, string> = {
    choiceGame: "Wybierz",
    dndGame: "Przyporządkuj",
    mapGame: "Znajdź na mapie",
    promptGame: "Zgadnij",
    typingGame: "Podpisz",
};

export function GameModes({ options, onChange }: GameModesProps) {
    const switchModes = (mode: GameType) => {
        if (mode !== options.gameType) {
            onChange({
                ...options,
                gameType: mode,
            });
        }
    };

    const otherModes = gameTypesFromCombo(options);
    return (
        <div className="flex flex-col mx-[-12px] mt-[12px]">
            {otherModes.map((mode) =>
                <RadioButton
                    key={mode}
                    label={LABELS[mode]}
                    checked={options.gameType === mode}
                    onClick={() => switchModes(mode)}
                />
            )}
        </div>
    );
}
