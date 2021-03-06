import { enableStaticRendering } from "mobx-react-lite";
import React, { createContext, ReactNode, useContext } from "react";
import { RootStore, HydrationData } from "../stores/RootStore";

enableStaticRendering(typeof window === "undefined");

let store: RootStore;
const StoreContext = createContext<RootStore | undefined>(undefined);

export function useRootStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }

  return context;
}

export function useErrorStore() {
  const { errorStore } = useRootStore();
  return errorStore;
}

export function useNoticeStore() {
  const { noticeStore } = useRootStore();
  return noticeStore;
}

export function useProfileStore() {
  const { profileStore } = useRootStore();
  return profileStore;
}

export function useChatStore() {
  const { chatStore } = useRootStore();
  return chatStore;
}

export function useVotingStore() {
  const { votingStore } = useRootStore();
  return votingStore;
}

export function RootStoreProvider({
  children,
  hydrationData,
}: {
  children: ReactNode;
  hydrationData?: HydrationData;
}) {
  const store = initializeStore(hydrationData);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

function initializeStore(initialData?: HydrationData): RootStore {
  const _store = store ?? new RootStore();

  if (initialData) {
    _store.hydrate(initialData);
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}