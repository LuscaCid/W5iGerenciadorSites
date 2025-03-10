import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { HeaderSearchDialog } from "./HeaderSearchDialog";
import { MenuDropdown } from "./MenuDropdown";
/**
 * @summary Header para desktop sizes
 * @author Lucas Cid
 * @created 06/03/2025
 * @returns 
 */
export function Header ( ) 
{
    const [ isSearchWindowOpen, setIsSearchWindowOpen ] = useState(false);
    const [ isMenuDropdownOpen, setIsMenuDropdownOpen ] = useState(false);
    useEffect(() => {
        function listnerCB (e : KeyboardEvent) {
            if (e.key === 'Escape' && isSearchWindowOpen) {
                setIsSearchWindowOpen(false);
            }
        }
        window.addEventListener('keydown',listnerCB);
        
        return () => window.removeEventListener("keydown", listnerCB);
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
                    to="/" 
                    className="bg-zinc-500 text-zinc-50  hover:bg-zinc-600"
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
        </header>
    );
}

interface HeaderLinkProps 
{
    to : string;
    title : string;
    className? : string;
    onClick : () => void;
}
export function HeaderLink ({ title, to, className, onClick } : HeaderLinkProps) 
{
    const path = useLocation();
    const pathDictionary = path.pathname.split('/')[1];
    const route = to.split('/')[1];
    return (
        <Link 
            onClick={onClick}
            className={twMerge([`${pathDictionary == route ? "border-b-[4px] border-blue-500" : "border-b-[4px] border-transparent" } px-10 py-8 text-lg hover:bg-blue-500 hover:text-zinc-100 flex items-center justify-center transition duration-150 `], [className]) } 
            to={to}
        >
            {title}
        </Link > 
    );
}