import type { ZustandGetter, ZustandSetter } from "src/utils/zustand";
import { create } from "zustand";
import { createGameAPIActions } from "./actionFactory";
import { preloadImages } from "./images";
import { type GameAPI, type GameAPIOptions, type WithAPI } from "./types";

export async function createGameStore<StoreWithoutAPI extends object>(
    apiOptions: GameAPIOptions,
    initializer: (
        set: ZustandSetter<StoreWithoutAPI & WithAPI>,
        get: ZustandGetter<StoreWithoutAPI & WithAPI>,
    ) => StoreWithoutAPI,
) {
    // preload question and answer images
    await preloadImages(apiOptions.questionsAndAnswers, apiOptions);

    return create<StoreWithoutAPI & WithAPI>()((set, get) => {
        // this function wraps around the normal `set` function from zustand
        // so that the game API store can only modify the .api field of the game store
        const apiSet = (partial: Partial<GameAPI> | ((state: GameAPI) => Partial<GameAPI>)) => {
            set((game) => ({
                api: {
                    ...game.api,
                    ...(typeof partial === "function") ? partial(game.api) : partial,
                } satisfies GameAPI,
            } as Partial<StoreWithoutAPI & WithAPI>));
        };
        // this is so that the game API store can only read the state of the .api field of the game store
        const apiGet = () => get().api;

        return {
            // initialize the part of the game store that is controlled by the stores of the individual game mode
            ...initializer(set, get),
            // overwrite the .api field with the game API
            api: createGameAPI(apiSet, apiGet, apiOptions),
        };
    });
}

function createGameAPI(set: ZustandSetter<GameAPI>, get: ZustandGetter<GameAPI>, apiOptions: GameAPIOptions): GameAPI {
    return {
        state: "unpaused",
        timestamps: [Date.now()],

        options: apiOptions,

        numberGuessed: 0,

        points: 0,
        maxPoints: 4 * apiOptions.questionsAndAnswers.questionIds.length,

        ...apiOptions.questionsAndAnswers,
        ...createGameAPIActions(set, get),
    };
}
