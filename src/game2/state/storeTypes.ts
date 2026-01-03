import type { ChoiceGameStore } from "./choice";
import type { DnDGameStore } from "./dnd";
import type { PromptGameStore } from "./prompt";

export type GameStore = ChoiceGameStore | DnDGameStore | PromptGameStore;
