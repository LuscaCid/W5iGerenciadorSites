import { LucideIcon } from "lucide-react";
import { MouseEvent } from "react";

interface TextButtonProps 
{
    onClick : (e : MouseEvent) => void;
    title? : string;
    className? : string;
    icon? : LucideIcon;
    iconSize? : number;
}
export const TextButton = ({ onClick, title, className, icon : Icon, iconSize = 16} : TextButtonProps) => 
{
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer px-2 py-2 flex items-center w-fit ${Icon && "justify-between"} ${className}`}
        >
            { Icon && <Icon size={iconSize} /> }
            { title }
        </button>
    );   
}