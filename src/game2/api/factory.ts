import type { ZustandGetter, ZustandSetter } from "src/utils/zustand";
import { create } from "zustand";
import { createGameAPIActions } from "./actionFactory";
import { getQuestionsAndAnswers } from "./questionGenerator";
import { type Answers, type GameAPI, type GameAPIOptions, type Questions, type WithAPI } from "./types";
import { preloadImages } from "./images";

export async function createGameStore<StoreWithoutAPI extends object>(
    apiOptions: GameAPIOptions,
    initializer: (set: ZustandSetter<StoreWithoutAPI>, get: ZustandGetter<StoreWithoutAPI>) => StoreWithoutAPI,
) {
    const questionsAndAnswers = getQuestionsAndAnswers(apiOptions);
    await preloadImages(questionsAndAnswers, apiOptions);

    return create<StoreWithoutAPI & WithAPI>()((set, get) => {
        const apiSet = (partial: Partial<GameAPI> | ((state: GameAPI) => Partial<GameAPI>)) => {
            set((game) => ({
                api: {
                    ...game.api,
                    ...(typeof partial === "function") ? partial(game.api) : partial,
                } satisfies GameAPI,
            } as Partial<StoreWithoutAPI & WithAPI>));
        };
        const apiGet = () => get().api;

        return {
            ...initializer(set, get),
            api: createGameAPI(apiSet, apiGet, questionsAndAnswers, apiOptions),
        };
    });
}

function createGameAPI(
    set: ZustandSetter<GameAPI>,
    get: ZustandGetter<GameAPI>,
    qsAndAs: Questions & Answers,
    apiOptions: GameAPIOptions,
): GameAPI {
    return {
        state: "unpaused",
        timestamps: [Date.now()],
        options: apiOptions,
        numberGuessed: 0,
        ...qsAndAs,
        ...createGameAPIActions(set, get),
    };
}
