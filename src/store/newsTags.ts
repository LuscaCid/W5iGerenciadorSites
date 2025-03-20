import { create } from "zustand";
import {Tag} from "../@types/Tag";
interface NewsTagsContext {
    selectedTags : Array<Tag>;
    title : string;
    setSelectedTags : (tags : Array<Tag>) => void;
    setTitle : (title : string) => void;
}
export const useNewsTagsContext = create<NewsTagsContext>((set) => ({
    selectedTags : [],
    title : "",
    setTitle : (newTitle) => set({title : newTitle}),
    setSelectedTags : (tags) => set({selectedTags : tags}),
}));