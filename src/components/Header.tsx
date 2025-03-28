import { Logo } from "./Logo";
import {useCallback, useEffect, useState} from "react";
import { HeaderSearchDialog } from "./Dialogs/HeaderSearchDialog.tsx";
import { MenuDropdown } from "./MenuDropdown";
import { HeaderLink } from "./HeaderLink";
import { useUserContext } from "../store/user";
import { UserDropdown } from "./UserDropdown";
import {useQuery} from "@tanstack/react-query";
import {useLinks} from "../hooks/useLinks.ts";
import {useTransparencyLinkContext} from "../store/transparencyLink.ts";
import {Search, SunMoon} from "lucide-react";
import {Link} from "react-scroll"
import {SectionsScroll} from "../constants/SectionsScroll.ts";
import {NavLink} from "react-router-dom";
import {Button} from "../UI/Button.tsx";
import {StorageKeys} from "../constants/StorageKeys.ts";
interface Props {
    isHomePage? : boolean
}
/**
 * @summary Header para desktop sizes
 * @author Lucas Cid
 * @created 06/03/2025
 * @returns 
 */
export function Header ({ isHomePage } : Props)
{
    const user = useUserContext((state) => state.user);
    const [ isSearchWindowOpen, setIsSearchWindowOpen ] = useState(false);
    const [ isMenuDropdownOpen, setIsMenuDropdownOpen ] = useState(false);
    const transparencyLinkContext = useTransparencyLinkContext();

    const { getLinks } = useLinks();

    const { data : links } = useQuery({
        queryFn : async () => await getLinks(),
        queryKey : ["links"]
    })

    const handleCloseDialog = () => {
        setIsSearchWindowOpen(false);
    }
    useEffect(() => {
        if (links)
        {
            const transparencyLink = links.find((link) => link.fl_transparencia)
            transparencyLink && transparencyLinkContext.setTransparencyLink(transparencyLink);
        }
    }, [ links, transparencyLinkContext.setTransparencyLink ]);
    const handleChangeTheme = useCallback(() => {
        const theme = localStorage.getItem(StorageKeys.theme);
        const html = document.querySelector("html")!;

        if (theme && theme == "dark")
        {
            localStorage.removeItem(StorageKeys.theme);
            html.classList.remove("dark");
            return;
        }
            html.classList.add("dark")
            localStorage.setItem(StorageKeys.theme, "dark");

    }, [])
    return (
        <section className={`flex  flex-col fixed  z-50  w-full   `}>
            {
                <header className={` p-2 px-2 md:px-40 w-full 2xl:px-56 justify-between bg-zinc-300/80 dark:bg-zinc-950/80  backdrop-blur-lg gap-4 ${isHomePage ? "translate-y-0" : "-translate-y-14 "}  transition duration-200 flex items-center `}>
                    <HeaderSearchDialog
                        customTrigger={(
                            <button
                                onClick={() => setIsSearchWindowOpen(!isSearchWindowOpen) }
                                className={"w-[300px] rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-between px-3 py-2 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition duration-150 cursor-text"}
                            >
                                <span className={"text-sm text-zinc-700 dark:text-zinc-100"}>
                                    Pesquisar
                                </span>
                                <span className={"rounded-full p-1 bg-zinc-300 dark:bg-zinc-700"}>
                                    <Search size={15}/>
                                </span>
                            </button>
                        )}
                        setIsSearchWindowOpen={setIsSearchWindowOpen}
                        isSearchWindowOpen={isSearchWindowOpen}
                    />
                    <aside className={"flex items-center gap-4"}>
                        <ul className={"flex items-center gap-0"}>
                            <ItemSetSection type={"left"} id={SectionsScroll.banner} title={"Destaque"}/>
                            <ItemSetSection type={"middle"} id={SectionsScroll.news} title={"Conteúdo"}/>
                            <ItemSetSection type={"right"} id={SectionsScroll.footer} title={"Rodapé"}/>
                        </ul>
                        <ul className={"flex items-center gap-4 border-l border-zinc-400 px-4 border-r "}>
                            <SubMenuLink to={"/"} title={"FAQ"}/>
                            <SubMenuLink to={"/ouvidoria"} title={"Ouvidoria"}/>
                        </ul>
                        <Button
                            onClick={handleChangeTheme}
                            className={"rounded-full p-2"}
                            icon={SunMoon}
                        />
                    </aside>
                </header>
            }
            <header
                id="header"
                className={`hidden lg:flex m-auto px-2 md:px-40 2xl:px-56 dark:bg-zinc-800/80  top-0 lg:sticky  gap-10 items-center justify-between w-full bg-zinc-100/80  backdrop-blur-lg ${isHomePage ? "translate-y-0" : "-translate-y-14"}  transition duration-200`}
            >
                <Logo title="Prefeitura" to="/"/>
                <ul className="flex items-center">
                    <HeaderLink
                        onClick={handleCloseDialog}
                        title="Notícias"
                        to="/noticias"
                    />
                    <HeaderLink
                        to={""}
                        title={"Sobre"}
                        onClick={handleCloseDialog}
                    />
                    {
                        transparencyLinkContext.transparencyLink && (
                            <HeaderLink
                                description={"Navegar para "+ transparencyLinkContext.transparencyLink.nm_link}
                                onClick={handleCloseDialog}
                                title={transparencyLinkContext.transparencyLink.nm_link}
                                to={transparencyLinkContext.transparencyLink.url_link}
                                className="bg-zinc-500 text-zinc-100 hover:bg-zinc-600"
                                target="_blank"
                                split={false}
                            />
                        )
                    }

                    <HeaderSearchDialog
                        isSearchWindowOpen={isSearchWindowOpen}
                        setIsSearchWindowOpen={setIsSearchWindowOpen}
                    />
                </ul>
                <aside className={"flex items-center gap-5"}>
                    <MenuDropdown
                        isMenuDropdownOpen={isMenuDropdownOpen}
                        setIsMenuDropdownOpen={setIsMenuDropdownOpen}
                    />
                    {
                        user && <UserDropdown/>
                    }
                </aside>
            </header>
        </section>

    );
}
interface SectionProps {
    id : string,
    title : string
    type : "left"| "middle" | "right";
}

const ItemSetSection  = ({id, title, type} : SectionProps) => {
    const stylesAccordingType = {
        "right" : "rounded-l-none rounded-r-full border-l-none",
        "left" : "rounded-r-none rounded-l-full border-r-none",
        "middle" : "rounded-none border-l border-r border-blue-300",
    }
    return (
        <Link smooth to={id} className={` bg-blue-500 rounded-md hover:shadow-2xl shadow-blue-600 cursor-pointer hover:bg-blue-600 font-semibold text-white px-3 py-1.5 transition-all duration-600 ${stylesAccordingType[type]}`}>
            {title}
        </Link>
    )
}
interface SubMenuLinkProps {
    to : string;
    title : string;
}
const SubMenuLink = ({ to, title} : SubMenuLinkProps) => (
    <NavLink
        className={"text-blue-500 border-b-[4px] border-transparent font-semibold  transition hover:border-blue-400"}
        to={to}
    >
        {title}
    </NavLink>
)