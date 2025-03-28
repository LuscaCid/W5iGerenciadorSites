import { LucideIcon } from "lucide-react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { MouseEvent } from "react";
interface CustomDropdownItemProps 
{
    title : string;
    icon : LucideIcon;
    onClick? : (e : MouseEvent) => void;
}
export const CustomDropdownItem = ({ onClick, title, icon : Icon } : CustomDropdownItemProps) => {
    return (
        <Dropdown.Item
            className="p-2 items-center justify-between gap-2 flex hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-900  hover:outline-none transition duration-150 cursor-pointer rounded-md"
            onClick={onClick}
        >
            <span>
                { title }
            </span>
            <Icon size={18} />
        </Dropdown.Item>
    )
}
