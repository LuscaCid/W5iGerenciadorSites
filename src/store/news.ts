import { create } from "zustand";
import {Noticia} from "../@types/News";

interface NewsContext {
    news: Noticia[],
    setNews : (news: Noticia[]) => void,
}

export const useNewsContext = create<NewsContext>((set) => ({
    news : [],
    setNews : (news) => set({news})
}));