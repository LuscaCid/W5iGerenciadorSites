import { LucideIcon } from "lucide-react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { MouseEvent } from "react";
interface CustomDropdownItemProps 
{
    onClick : (e : MouseEvent) => void;
    title : string;    
    icon : LucideIcon;
}
export const CustomDropdownItem = ({ onClick, title, icon : Icon } : CustomDropdownItemProps) => {
    return (
        <Dropdown.Item
            className="p-2 items-center justify-between gap-2 flex hover:bg-zinc-200  transition duration-150 cursor-pointer rounded-md"
            onClick={onClick}
        >
            <span>
                { title }
            </span>
            <Icon size={18} />
        </Dropdown.Item>
    )
}
