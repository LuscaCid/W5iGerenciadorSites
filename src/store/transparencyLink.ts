import { create } from "zustand";
import {Link} from "../@types/Link";
interface TransparencyLinkContext {
    transparencyLink? : Link,
    setTransparencyLink : (transparencyLink? : Link) => void
}
export const useTransparencyLinkContext = create<TransparencyLinkContext>((set) => ({
    transparencyLink : undefined,
    setTransparencyLink : (transparencyLink) => set({ transparencyLink })
}));