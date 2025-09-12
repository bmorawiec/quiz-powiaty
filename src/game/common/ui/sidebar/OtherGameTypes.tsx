import { gameTypesFromCombo, type GameOptions, type GameType } from "src/gameOptions";
import { RadioButton } from "src/ui";

export interface OtherGameTypesProps {
    options: GameOptions;
    onGameTypeChange: (newGameType: GameType) => void;
}

const gameTypeNames: Record<GameType, string> = {
    choiceGame: "Wybierz",
    dndGame: "Przyporządkuj",
    mapGame: "Znajdź na mapie",
    promptGame: "Zgadnij",
    typingGame: "Podpisz",
};

export function OtherGameTypes({ options, onGameTypeChange }: OtherGameTypesProps) {
    const otherGameTypes = gameTypesFromCombo(options);

    return (
        <div className="flex flex-col px-[18px] mt-[-12px] mb-[12px]">
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
