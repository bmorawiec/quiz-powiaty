import clsx from "clsx";
import { gameTypesFromCombo, type GameOptions, type GameType } from "src/gameOptions";
import { RadioButton } from "src/ui";

export interface OtherGameTypesProps {
    options: GameOptions;
    onGameTypeChange: (newGameType: GameType) => void;
    className?: string;
}

const gameTypeNames: Record<GameType, string> = {
    choiceGame: "Wybierz",
    dndGame: "Przyporządkuj",
    mapGame: "Znajdź na mapie",
    promptGame: "Zgadnij",
    typingGame: "Podpisz",
};

export function OtherGameTypes({ options, onGameTypeChange, className }: OtherGameTypesProps) {
    const otherGameTypes = gameTypesFromCombo(options);

    return (
        <div className={clsx("flex flex-col px-[18px]", className)}>
            {otherGameTypes.map((gameType) => {
                const handleRadioClick = () => {
                    if (gameType !== options.gameType) {
                        onGameTypeChange(gameType);
                    }
                };

                return (
                    <RadioButton
                        key={gameType}
                        checked={gameType === options.gameType}
                        label={gameTypeNames[gameType]}
                        onClick={handleRadioClick}
                    />
                );
            })}
        </div>
    );
}
