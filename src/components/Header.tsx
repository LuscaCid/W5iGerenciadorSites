import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { TextButton } from "../UI/TextButton";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog"; 
/**
 * @summary Header para desktop sizes
 * @author Lucas Cid
 * @created 06/03/2025
 * @returns 
 */
export function Header ( ) 
{
    const [ isSearchWindowOpen, setIsSearchWindowOpen ] = useState(false);
    useEffect(() => {
        function listnerCB (e : KeyboardEvent) {
            if (e.key === 'Escape' && isSearchWindowOpen) {
                setIsSearchWindowOpen(false);
            }
        }
        window.addEventListener('keydown',listnerCB);
        
        return () => window.removeEventListener("keydown", listnerCB);
    }, [isSearchWindowOpen])
    return (
        <header 
            id="header"
            className="hidden md:flex m-auto top-0 mb-20  gap-10 items-center justify-center w-full bg-zinc-100/60 fixed z-50 backdrop-blur-sm"
        >
            <Logo title="Prefeitura" to="/"/>
            <ul className="flex items-center">
                <HeaderLink 
                    title="Governo" 
                    to="/governo" 
                />
                <HeaderLink 
                    title="Notícias" 
                    to="/noticias"
                />
                <HeaderLink 
                    title="Município" 
                    to="/municipio"
                />
                <HeaderLink 
                    title="Transparência" 
                    to="/" 
                    className="bg-zinc-500 text-zinc-50  hover:bg-zinc-600"
                />
                <Dialog.Root onOpenChange={setIsSearchWindowOpen} open={isSearchWindowOpen}>
                    <Dialog.Trigger asChild>
                        <TextButton 
                            className={`hover:bg-blue-200 transition duration-150 py-9 px-10`}
                            onClick={() => setIsSearchWindowOpen(!isSearchWindowOpen)}
                            icon={Search}
                            iconSize={20}
                        />
                    </Dialog.Trigger>
                        {/* a busca será realizada com base nas noticias encontradas com aquela informação passada */}
                        <Dialog.Content className="z-50 absolute inset-0 overflow-hidden bg-zinc-200">
                            <header className="flex items-center bg-zinc-100">
                                <div className="items-center flex px-10 w-full border-b border-zinc-100 ">
                                    <Search />
                                    <input 
                                        type="text" 
                                        placeholder="Pesquisar" 
                                        className=" px-10 py-4 text-lg  w-full focus:outline-none " 
                                    />
                                </div>
                                <TextButton 
                                    className="px-10 py-[23px] bg-zinc-500 hover:bg-zinc-700 transition duration-200"
                                    icon={X}
                                    onClick={() => setIsSearchWindowOpen(false)}
                                />
                            </header>
                            <main className="m-auto w-fit ">
                                <span className="text-lg opacity-40 select-none">
                                    pressione 'esc' para fechar ou 'enter' para realizar uma busca 
                                </span>
                            </main>
                        </Dialog.Content>
                </Dialog.Root>
            </ul>
        </header>
    );
}

interface HeaderLinkProps 
{
    to : string;
    title : string;
    className? : string;
}
export function HeaderLink ({ title, to, className } : HeaderLinkProps) 
{
    const path = useLocation();
    const pathDictionary = path.pathname.split('/')[1];
    const route = to.split('/')[1];
    return (
        <Link 
            className={`${pathDictionary == route ? "border-b-[4px] border-blue-500" : "border-b-[4px] border-transparent" } px-10 py-8 text-lg hover:bg-blue-500 hover:text-zinc-100 flex items-center justify-center transition duration-150 ${className}`} 
            to={to}
        >
            {title}
        </Link > 
    );
}