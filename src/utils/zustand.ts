import type { UseBoundStore, StoreApi } from "zustand";

export type ZustandHook<TStore> = UseBoundStore<StoreApi<TStore>>;
export type ZustandGetter<TStore> = ZustandHook<TStore>["getState"];
export type ZustandSetter<TStore> = ZustandHook<TStore>["setState"];
