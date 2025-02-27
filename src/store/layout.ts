import { create } from "zustand";

interface LayoutContext 
{
    actualLayout : string;
    setActualLayout : (layout : string) => void;
}
export const useLayoutContext = create<LayoutContext>((set) => ({
    actualLayout : "",
    setActualLayout : (newLayout) => set({actualLayout : newLayout})
}));