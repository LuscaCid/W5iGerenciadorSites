import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import {HTMLAttributeAnchorTarget} from "react";
import {Tooltip} from "@mui/material";

interface HeaderLinkProps 
{
    to : string;
    title : string;
    className? : string;
    onClick : () => void;
    split? : boolean;
    target? : HTMLAttributeAnchorTarget
    description? : string
}
export function HeaderLink ({ title, to, className, onClick, target = "_self" , split = true, description } : HeaderLinkProps)
{
    const path = useLocation();
    const pathDictionary = path.pathname.split('/')[1];
    const route = split ? to.split('/')[1] : to;
    return (
        <Tooltip
            enterDelay={300}
            enterNextDelay={300}
            title={description}
        >
            <Link
                target={target}
                onClick={onClick}
                className={twMerge([`${pathDictionary == route ? "border-b-[4px] border-blue-500" : "border-b-[4px] border-transparent" } px-10 py-8 text-lg hover:bg-blue-500 hover:text-zinc-100 dark:bg-zinc-8   00 flex items-center justify-center transition duration-150 `], [className]) }
                to={to}
            >
                {title}
            </Link >
        </Tooltip>

    );
}