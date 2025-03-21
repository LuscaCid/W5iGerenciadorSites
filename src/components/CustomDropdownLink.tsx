import { LucideIcon } from "lucide-react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {Link} from "react-router-dom";

interface CustomDropdownLinkProps
{
    title : string;
    icon : LucideIcon;
    to : string;
}
export const CustomDropdownLink = ({ title, icon : Icon, to } : CustomDropdownLinkProps) => {
    return (
        <Dropdown.Item
            className="p-2 items-center justify-between gap-2 flex hover:bg-zinc-200  hover:outline-none transition duration-150 cursor-pointer rounded-md"
        >
            <Link target={"_blank"} to={to}>
                { title }
            </Link>
            <Icon size={18} />
        </Dropdown.Item>
    )
}
