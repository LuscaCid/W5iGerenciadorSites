import { create } from "zustand";
import {ToastVariants} from "../@types/ToastVariants";
interface ToastContext
{
    isOpen : boolean;
    message : string;
    variant : ToastVariants;
    open : (message? : string, variant? : ToastVariants) => void;
    close : () => void;

}

export const useToastContext = create<ToastContext>((set) => ({
    variant : 'success',
    close : () => set({isOpen : false}),
    isOpen : false,
    open : () => set({isOpen: true}),
    message : ""
}) )

