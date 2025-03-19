import { create } from "zustand";
import {Tag} from "../@types/Tag";
interface NewsTagsContext {
    selectedTags : Array<Tag>;
    setSelectedTags : (tags : Array<Tag>) => void;
}
export const useNewsTagsContext = create<NewsTagsContext>((set) => ({
    selectedTags : [],
    setSelectedTags : (tags) => set({selectedTags : tags}),
}));