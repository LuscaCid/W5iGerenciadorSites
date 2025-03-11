import { LucideIcon } from "lucide-react";
import { MouseEvent } from "react";
import { twMerge } from 'tailwind-merge'
interface ButtonProps 
{
    onClick : (e : MouseEvent) => void;
    title? : string;
    className? : string;
    icon? : LucideIcon;
    iconSize? : number;
    disabled? : boolean;
    type? : "submit" | "reset" | "button" | undefined;
    form? : string;
}
export const Button = ({ onClick, title, className, icon : Icon, iconSize = 16, disabled, type = "button", form } : ButtonProps) => 
{
    return (
        <button 
            form={form}
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={twMerge([`px-6 py-4 flex items-center justify-center cursor-pointer rounded-md bg-zinc-200 hover:bg-zinc-300 ${disabled ? "opacity-60 cursor-not-allowed hover:bg-zinc-200" : ""} transition duration-150 flex items-center ${Icon && "justify-between gap-1"}`], [className])}
        >
            { Icon && <Icon size={iconSize} /> }
            { title }
        </button>
    );   
}