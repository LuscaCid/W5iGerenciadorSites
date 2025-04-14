import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { TextButton } from "../UI/TextButton";
import {useEffect, useState} from "react";
import { IconButton } from "@mui/material";
import { HeaderSearchDialog } from "./Dialogs/HeaderSearchDialog.tsx";
import { HeaderLink } from "./HeaderLink";
import { UserDropdown } from "./UserDropdown";
import { useUserContext } from "../store/user";
import {useQuery} from "@tanstack/react-query";
import {useLinks} from "../hooks/useLinks.ts";
import {MenuDropdown} from "./MenuDropdown.tsx";
import {useTransparencyLinkContext} from "../store/transparencyLink.ts";

export function MobileHeader ()
{
    const { getLinks } = useLinks();
    const [ isMenuDropdownOpen, setIsMenuDropdownOpen ] = useState(false);
    const transparencyLinkContext = useTransparencyLinkContext();

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

    useEffect(() => {
        if (links)
        {
            const transparencyLink = links.find((link) => link.fl_transparencia)
            transparencyLink && transparencyLinkContext.setTransparencyLink(transparencyLink);
        }
    }, [ links, transparencyLinkContext.setTransparencyLink ]);
    return (
        <header className="md:hidden  bg-zinc-100/80 dark:bg-zinc-900/70  fixed z-50 backdrop-blur-lg flex justify-between items-center px-4 py-2 w-full">
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
            <nav className={`absolute ${isOpenSidebar ? "inset-0 flex flex-col z-20" : "hidden"}  bg-zinc-50 dark:bg-zinc-900 transition duration-200  items-center`}>
                <header className={"flex items-center gap-2  w-full justify-between h-fit"}>
                    <MenuDropdown
                        isMobile
                        isMenuDropdownOpen={isMenuDropdownOpen}
                        setIsMenuDropdownOpen={setIsMenuDropdownOpen}
                    />

                    <IconButton
                        color="error"
                        onClick={handleOpenSideBar}
                        className=""
                    >
                        <X />
                    </IconButton>
                </header>

                <HeaderLink
                    onClick={handleOpenSideBar}
                    title="Home"
                    to="/"
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Município"  
                    to="/municipio"
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Governo" 
                    to="/governo"   
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Secretarias" 
                    to="/secretaria"   
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Notícias" 
                    to="/noticias" 
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800"
                />
                <HeaderLink
                    onClick={handleOpenSideBar}
                    title="FAQ"
                    to="/faq"
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800"
                />
                {
                    transparencyLinkContext.transparencyLink && (
                        <HeaderLink
                            onClick={handleOpenSideBar}
                            title={transparencyLinkContext.transparencyLink.nm_link}
                            to={transparencyLinkContext.transparencyLink.url_link}
                            className="bg-slate-200 py-3 w-full dark:bg-slate-800 dark:text-zinc-100 text-black hover:bg-slate-300"
                            target={"_blank"}
                            split={false}
                        />
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