import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { HeaderSearchDialog } from "./Dialogs/HeaderSearchDialog.tsx";
import { MenuDropdown } from "./MenuDropdown";
import { HeaderLink } from "./HeaderLink";
import { useUserContext } from "../store/user";
import { UserDropdown } from "./UserDropdown";
import {Link} from "../@types/Link";

/**
 * @summary Header para desktop sizes
 * @author Lucas Cid
 * @created 06/03/2025
 * @returns 
 */
interface Props {
    links : Link[]
}
export function Header ({ links } : Props)
{
    const user = useUserContext((state) => state.user);
    const [ isSearchWindowOpen, setIsSearchWindowOpen ] = useState(false);
    const [ isMenuDropdownOpen, setIsMenuDropdownOpen ] = useState(false);
    useEffect(() => {
        function listenerCB (e : KeyboardEvent) {
            if (e.key === 'Escape' && isSearchWindowOpen) {
                setIsSearchWindowOpen(false);
            }
        }
        window.addEventListener('keydown',listenerCB);
        
        return () => window.removeEventListener("keydown", listenerCB);
    }, [isSearchWindowOpen])
    const handleCloseDialog = () => {
        setIsSearchWindowOpen(false);
    }
    return (
        <header 
            id="header"
            className="hidden md:flex m-auto top-0 mb-20  gap-10 items-center   justify-center w-full bg-zinc-100/60 fixed z-50 backdrop-blur-lg"
        >
            <Logo title="Prefeitura" to="/"/>
            <ul className="flex items-center">
                <HeaderLink 
                    onClick={handleCloseDialog}
                    title="Governo" 
                    to="/governo" 
                />
                <HeaderLink 
                    onClick={handleCloseDialog}
                    title="Notícias" 
                    to="/noticias"
                />
                <HeaderLink 
                    onClick={handleCloseDialog}
                    title="Município" 
                    to="/municipio"
                />
                <HeaderLink 
                    onClick={handleCloseDialog}
                    title="Transparência" 
                    to="https://w5i-portal-transparencia-frontend.vercel.app/" 
                    className="bg-zinc-500 text-zinc-50  hover:bg-zinc-600"
                    target="_blank"
                />
                <HeaderSearchDialog 
                    isSearchWindowOpen={isSearchWindowOpen}
                    setIsSearchWindowOpen={setIsSearchWindowOpen}
                />
                <MenuDropdown
                    isMenuDropdownOpen={isMenuDropdownOpen}
                    setIsMenuDropdownOpen={setIsMenuDropdownOpen}
                />
            </ul>
            {
                user && <UserDropdown/>
            }
        </header>
    );
}
