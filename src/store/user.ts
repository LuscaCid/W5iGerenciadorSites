import { create } from "zustand";
import { User } from "../@types/User";

interface UserContext 
{
    user : User|undefined;
    setUser : (newUser : User) => void;
}
export const useUserContext = create<UserContext>((set) => ({
    setUser : (newUser) => set({ user : newUser }),
    user : undefined,
}));