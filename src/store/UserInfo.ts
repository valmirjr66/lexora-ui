import { create } from "zustand";

export interface UserInfo {
  id: string;
  email: string;
  fullname: string;
  birthdate: string;
  profilePicFileName?: string;
}

export interface UserInfoMutator {
  data: UserInfo | null;
  setData: (newData: UserInfo | null) => void;
}

const useUserInfoStore = create<UserInfoMutator>((set) => ({
  data: null,
  setData: (newData) => set(() => ({ data: newData })),
}));

export { useUserInfoStore };
