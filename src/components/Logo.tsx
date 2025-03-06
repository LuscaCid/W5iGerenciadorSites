import { Link } from "react-router-dom";

interface LogoProps 
{
    to : string;
    title : string;
    isEdition? : boolean;
}
export function Logo ({ title, to } : LogoProps)
{
    return (
        <h1 className="bg-blue-500 text-2xl select-none font-bold text-zinc-50 p-2 rounded-md">
            <Link to={to}>
                {title}
            </Link >
        </h1>
    );
}