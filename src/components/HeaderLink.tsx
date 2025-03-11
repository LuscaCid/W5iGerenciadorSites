import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface HeaderLinkProps 
{
    to : string;
    title : string;
    className? : string;
    onClick : () => void;
    target? : React.HTMLAttributeAnchorTarget
}
export function HeaderLink ({ title, to, className, onClick, target = "_self" } : HeaderLinkProps) 
{
    const path = useLocation();
    const pathDictionary = path.pathname.split('/')[1];
    const route = to.split('/')[1];
    return (
        <Link 
            target={target}
            onClick={onClick}
            className={twMerge([`${pathDictionary == route ? "border-b-[4px] border-blue-500" : "border-b-[4px] border-transparent" } px-10 py-8 text-lg hover:bg-blue-500 hover:text-zinc-100 flex items-center justify-center transition duration-150 `], [className]) } 
            to={to}
        >
            {title}
        </Link > 
    );
}