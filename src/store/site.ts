import { create } from "zustand";
import {Site} from "../@types/Site";

interface SiteContext {
    site? : Site
    setSite(site : Site): void
}

export const useSiteContext = create<SiteContext>((set) => ({
    site : undefined,
    setSite : (site) => set({ site })
}));