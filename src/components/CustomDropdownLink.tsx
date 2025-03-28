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
            asChild
        >
            <Link
                className="p-2 items-center justify-between gap-2 flex hover:bg-zinc-200  dark:hover:bg-zinc-900 hover:outline-none transition duration-150 cursor-pointer rounded-md"
                target={"_blank"} to={to}>
                { title }
                <Icon size={18} />
            </Link>

        </Dropdown.Item>
    )
}
