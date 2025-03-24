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
import {Link} from "../@types/Link";
import {MenuDropdown} from "./MenuDropdown.tsx";

export function MobileHeader ()
{
    const { getLinks } = useLinks();
    const [ transparencyLink, setTransparencyLink ] = useState<Link|undefined>(undefined);
    const [ isMenuDropdownOpen, setIsMenuDropdownOpen ] = useState(false);
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
            transparencyLink && setTransparencyLink(transparencyLink);
        }
    }, [ links, setTransparencyLink ]);
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
                    title="Home"
                    to="/"
                    className="w-full py-3 bg-zinc-100"
                />
                <HeaderLink 
                    onClick={handleOpenSideBar} 
                    title="Município"  
                    to="/municipio"
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
                {
                    transparencyLink && (
                        <HeaderLink
                            onClick={handleOpenSideBar}
                            title={transparencyLink.nm_link}
                            to={transparencyLink.url_link}
                            className="bg-slate-200 py-3 w-full text-black hover:bg-slate-300"
                            target={"_blank"}
                            split={false}
                        />
                    )
                }
                <footer className={"bg-zinc-100 w-full flex items-center justify-center"}>
                    <MenuDropdown
                        isMenuDropdownOpen={isMenuDropdownOpen}
                        setIsMenuDropdownOpen={setIsMenuDropdownOpen}
                    />

                </footer>

                <HeaderSearchDialog
                    isMobile
                    isSearchWindowOpen={isSearchWindowOpen}
                    setIsSearchWindowOpen={setIsSearchWindowOpen}
                />
            </nav>
        </header>
    );
}