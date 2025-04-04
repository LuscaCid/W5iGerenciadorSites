import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import {HTMLAttributeAnchorTarget, ReactNode} from "react";
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
    children?: ReactNode
}
export function HeaderLink ({ title, to, className, onClick, target = "_self" , split = true, description, children } : HeaderLinkProps)
{
    const path = useLocation();
    const pathDictionary = path.pathname.split('/')[1];
    const route = split ? to.split('/')[1] : to;
    const defaultStyle = `${pathDictionary == route ? "border-b-[4px] border-blue-500" : "border-b-[4px] border-transparent" } px-10 py-8 text-lg hover:bg-blue-500 hover:text-zinc-100 dark:bg-zinc-8   00 flex items-center justify-center transition duration-150 `;
    return (
        <Tooltip
            enterDelay={300}
            enterNextDelay={300}
            title={description}
        >
            { children ? (
                <article className={twMerge([defaultStyle], ["group relative"])}>
                    {title}
                    <main className={"absolute top-20  group-hover:translate-y-4 bg-zinc-200/90 opacity-0  backdrop-blur-md dark:bg-zinc-800/90 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"}>
                        {children}
                    </main>
                </article>
                ) : (
                <Link
                    target={target}
                    onClick={onClick}
                    className={twMerge([defaultStyle], [className]) }
                    to={to}
                >
                    {title}
                </Link >

            )}
        </Tooltip>

    );
}