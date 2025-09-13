import type { GameOptions } from "src/gameOptions";

export interface GameProps {
    onRestart: () => void;
    onOptionsChange: (newOptions: GameOptions) => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
}
