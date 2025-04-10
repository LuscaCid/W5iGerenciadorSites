import {Loader, LucideIcon} from "lucide-react";
import {MouseEvent} from "react";
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
    onPointerDown? : (e : MouseEvent) => void
    pendingMessage? : string;
}
export const Button = ({ onClick, title, className, icon : Icon, iconSize = 16, disabled, type = "button", form, description, isLoading, onPointerDown, pendingMessage } : ButtonProps) =>
{
    return (
        <Tooltip
            enterDelay={300}
            enterNextDelay={300}
            title={description}
            onPointerDown={onPointerDown}
        >
            <button
                form={form}
                disabled={disabled}
                type={type}
                onClick={onClick}
                className={twMerge([`px-6 py-4 w-fit text-sm dark:bg-zinc-700 ${type == "submit" ? "self-end" : ""} dark:hover:bg-zinc-800 font-semibold flex items-center justify-center cursor-pointer  rounded-md ${type == "submit" ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-zinc-100 " : "bg-zinc-200 hover:bg-zinc-300"}  ${disabled ? "opacity-60 cursor-not-allowed hover:dark:bg-zinc-700 hover:bg-zinc-200" : ""} transition duration-150 flex items-center ${Icon && "justify-between gap-1"} focus:outline-none focus:ring-[4px] ${type == "submit" ? "focus:ring-green-300 dark:focus:ring-green-600": "focus:ring-zinc-300 dark:focus:ring-zinc-500"} `], [className])}
            >
                { isLoading && type == "submit" ? pendingMessage ?  pendingMessage : "Salvando" : title }
                { isLoading && <Loader size={15} className={"animate-spin"}/>}
                { Icon && !isLoading && <Icon size={iconSize} className={"dark:text-zinc-100"} /> }
            </button>
        </Tooltip>
    );
}