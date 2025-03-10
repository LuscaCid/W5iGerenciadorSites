import { Tooltip } from "@mui/material";
import { LucideIcon } from "lucide-react";
import { MouseEvent } from "react";
import { twMerge } from "tailwind-merge";

interface TextButtonProps 
{
    onClick : (e : MouseEvent) => void;
    title? : string;
    className? : string;
    icon? : LucideIcon;
    iconSize? : number;
    description? : string;
    type? : "submit" | "reset" | "button" | undefined;

}
export const TextButton = ({ onClick, title, className, icon : Icon, iconSize = 16, description, type = "button"} : TextButtonProps) => 
{
    return (
        <Tooltip
            enterDelay={300}
            enterNextDelay={200}
            title={description}
        >
            <button
                type={type}
                onClick={onClick}
                className={twMerge([`cursor-pointer px-2 py-2 flex items-center w-fit ${Icon && "justify-between"}`, className])}
            >
                { title }
                { Icon && <Icon size={iconSize} /> }
            </button>
        </Tooltip>
   
    );   
}