import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let userStore = (set) => ({
  user: null,
  setUserData: (data) => set({ user: data }),
  logout: () => set({ user: null }),
});

let requestStore = (set) => ({
  // setCurrentCacheData: (data, key) => set((state) => ({ [key]: data })),
  setCurrentCacheData: (data, key) => set({ [key]: data }),
});

userStore = devtools(userStore);
userStore = persist(userStore, { name: "user_data" });

requestStore = devtools(requestStore);

export const useUserStore = create(userStore);
export const useRequestStore = create(requestStore);
