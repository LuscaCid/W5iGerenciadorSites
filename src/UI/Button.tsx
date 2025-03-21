import {Loader, LucideIcon} from "lucide-react";
import { MouseEvent } from "react";
import { twMerge } from 'tailwind-merge';
import { Tooltip } from "@mui/material";
interface ButtonProps 
{
    onClick? : (e : MouseEvent) => void;
    title? : string;
    className? : string;
    icon? : LucideIcon;
    iconSize? : number;
    disabled? : boolean;
    type? : "submit" | "reset" | "button" | undefined;
    form? : string;
    description? : string;
    isLoading? : boolean;
}
export const Button = ({ onClick, title, className, icon : Icon, iconSize = 16, disabled, type = "button", form, description, isLoading } : ButtonProps) =>
{
    return (
        <Tooltip
            enterDelay={300}
            enterNextDelay={300}
            title={description}
        >
            <button
                form={form}
                disabled={disabled}
                type={type}
                onClick={onClick}
                className={twMerge([`px-6 py-4 font-semibold flex items-center justify-center cursor-pointer  rounded-md ${type == "submit" ? "bg-green-500 hover:bg-green-600 text-zinc-100 " : "bg-zinc-200 hover:bg-zinc-300"}  ${disabled ? "opacity-60 cursor-not-allowed hover:bg-none" : ""} transition duration-150 flex items-center ${Icon && "justify-between gap-1"}`], [className])}
            >
                { isLoading && <Loader size={15} className={"animate-spin"}/>}
                { isLoading && type == "submit" ? "Salvando" : title }
                { Icon && !isLoading && <Icon size={iconSize} /> }
            </button>
        </Tooltip>
    );
}