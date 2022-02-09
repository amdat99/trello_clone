import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let userStore = (set) => ({
  user: null,
  setUserData: (data) => set({ user: data }),
  logout: () => set({ user: null }),
  currentBoard: null,
  setCurrentBoard: (data) => set({ currentBoard: data }),
  colorMode: "light",
  setColorMode: (color) => set({ colorMode: color }),
});

let requestStore = (set) => ({
  // setCurrentCacheData: (data, key) => set((state) => ({ [key]: data })),
  setCurrentCacheData: (data, key) => set({ [key]: data }),
});

let taskStore = (set) => ({
  taskModal: false,
  setTaskModal: (data) => set({ taskModal: data }),
});

userStore = devtools(userStore);
userStore = persist(userStore, { name: "user_data" });

requestStore = devtools(requestStore);

taskStore = devtools(taskStore);

export const useUserStore = create(userStore);
export const useRequestStore = create(requestStore);
export const useTaskStore = create(taskStore);
