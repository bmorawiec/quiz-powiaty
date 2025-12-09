import type { ChoiceGameStore } from "./choice";
import type { DnDGameStore } from "./dnd";

export type GameStore = ChoiceGameStore | DnDGameStore;
