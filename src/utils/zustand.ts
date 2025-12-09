import type { UseBoundStore, StoreApi } from "zustand";

export type ZustandGetter<TStore> = UseBoundStore<StoreApi<TStore>>["getState"];
export type ZustandSetter<TStore> = UseBoundStore<StoreApi<TStore>>["setState"];
