import { create } from "zustand";

export const useCodetore = create((set) => ({
  referralCode: "",
  setReferralCode: (value) => set({ referralCode: value }),
}));

export default useCodetore;
