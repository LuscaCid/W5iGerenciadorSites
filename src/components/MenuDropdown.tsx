import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { TextButton } from "../UI/TextButton";
import { Blend, Landmark, LucideIcon, Menu, Newspaper, ShieldUser, UtilityPole } from "lucide-react";
import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CustomDropdownItem } from "./CustomDropdownItem";
import { Separator } from "./Separator";

interface Props 
{
    setIsMenuDropdownOpen : React.Dispatch<React.SetStateAction<boolean>>;
    isMenuDropdownOpen: boolean;
    isMobile? : boolean;
}
export const MenuDropdown = ({ isMenuDropdownOpen, setIsMenuDropdownOpen, isMobile } : Props) => {
    const navigate = useNavigate();
    return (
        <Dropdown.Root
            modal={false}
            open={isMenuDropdownOpen}
            onOpenChange={setIsMenuDropdownOpen}
        >
            <Dropdown.Trigger 
                className={`${isMobile ? "bg-zinc-100 w-full items-center justify-center" : ""} hover:bg-blue-200 transition duration-150 py-9 px-10`}
            >
                <Menu />
            </Dropdown.Trigger>
            <Dropdown.Content className="flex flex-col gap-2 -top-10 border bg-zinc-100 -mt-5 border-zinc-200 shadow-lg rounded-lg p-2">
                <CustomDropdownItem 
                    onClick={() => navigate('/noticias')} 
                    title="Notícias" 
                    icon={Newspaper} 
                />
                <Separator />
                <CustomDropdownItem 
                    onClick={() => navigate('/governo')} 
                    title="Governo" 
                    icon={Landmark} 
                />
                <Separator />
                <CustomDropdownItem 
                    onClick={() => navigate('/municipio')} 
                    title="Município" 
                    icon={UtilityPole} 
                />
                <Separator />
                <CustomDropdownItem 
                    onClick={() => navigate('/')} 
                    title="Transparência" 
                    icon={Blend} 
                />
                <Separator />
                <CustomDropdownItem 
                    onClick={() => navigate('/login')} 
                    title="Acesso administrativo" 
                    icon={ShieldUser} 
                />
            </Dropdown.Content>
        </Dropdown.Root>
    );
}

