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
}
export const Button = ({  onClick, title, className, icon : Icon, iconSize = 16} : ButtonProps) => 
{
    return (
        <button 
            onClick={onClick}
            className={twMerge([`px-6 py-4 cursor-pointer rounded-md bg-zinc-200 hover:bg-zinc-300 transition duration-150 flex items-center ${Icon && "justify-between"}])`], [className])}
        >
            { Icon && <Icon size={iconSize} /> }
            { title }
        </button>
    );   
}