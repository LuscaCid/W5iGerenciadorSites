import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { TextButton } from "../UI/TextButton";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { HeaderSearchDialog } from "./Dialogs/HeaderSearchDialog.tsx";
import { HeaderLink } from "./HeaderLink";
import { UserDropdown } from "./UserDropdown";
import { useUserContext } from "../store/user";
import {useQuery} from "@tanstack/react-query";
import {useLinks} from "../hooks/useLinks.ts";

export function MobileHeader ()
{
    const { getLinks } = useLinks();
    const { data : links } = useQuery({
        queryFn : async () => await getLinks() ,
        queryKey : ["links"]
    })
    const [ isOpenSidebar, setIsOpenSidebar ] = useState(false);
    const [ isSearchWindowOpen, setIsSearchWindowOpen ] = useState(false);
    const user = useUserContext((state) => state.user);


    const handleOpenSideBar = () => {
        setIsOpenSidebar(!isOpenSidebar);
    }
    return (
        <header className="md:hidden  bg-zinc-100/60  fixed z-50 backdrop-blur-lg flex justify-between items-center px-4 py-2 w-full">
            <Logo title="Prefeitura" to="/"/>
            <aside className="flex items-center gap-3">
                {
                    user && <UserDropdown />
                }
                <TextButton 
                    icon={Menu}
                    onClick={handleOpenSideBar}
                />
            </aside>
            <nav className={`absolute ${isOpenSidebar ? "inset-0 flex flex-col z-20" : "hidden"}  bg-zinc-50 transition duration-200  items-center`}>
                <IconButton
                    color="error"
                    onClick={handleOpenSideBar}
                    className="self-end"
                >
                    <X />
                </IconButton>
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Município"  
                    to="/"  
                    className="w-full py-3 bg-zinc-100"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Governo" 
                    to="/governo"   
                    className="w-full py-3 bg-zinc-100"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Notícias" 
                    to="/noticias" 
                    className="w-full py-3 bg-zinc-100"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Transparência"  
                    to="/" 
                    className="bg-slate-200 py-3 w-full text-black hover:bg-slate-300"
                />
                {
                    links && links.length > 0 && (
                       <> a </>
                    )
                }
                <HeaderSearchDialog 
                    isMobile
                    isSearchWindowOpen={isSearchWindowOpen}
                    setIsSearchWindowOpen={setIsSearchWindowOpen}
                />
            </nav>
        </header>
    );
}