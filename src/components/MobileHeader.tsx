import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { TextButton } from "../UI/TextButton";
import { useState } from "react";
import { HeaderLink } from "./Header";

export function MobileHeader ()
{
    const [ isOpenSidebar, setIsOpenSidebar ] = useState(false);

    const handleOpenSideBar = () => {
        console.log("aaa");
        setIsOpenSidebar(!isOpenSidebar);
    }
    return (
        <header className="md:hidden  bg-zinc-100/60 fixed z-50 backdrop-blur-sm flex justify-between items-center px-4 py-2 w-full">
            <Logo title="Prefeitura" to="/"/>
            <TextButton 
                icon={Menu}
                onClick={handleOpenSideBar}
            />
            <nav className={`absolute ${isOpenSidebar ? "inset-0 flex flex-col z-10" : "hidden"}  bg-zinc-50 transition duration-200   items-center`}>
                <TextButton icon={X} onClick={() => setIsOpenSidebar(false)} className="absolute right-2 top-2"/>
                <HeaderLink title="Município"  to="/"  className="w-full py-2"/>
                <HeaderLink title="Governo" to="/governo"   className="w-full py-2"/>
                <HeaderLink title="Notícias" to="/noticias" className="w-full py-2"/>
                <HeaderLink title="Transparência"  to="/" className="bg-blue-500 text-zinc-50  hover:bg-blue-600"/>
            </nav>
        </header>
    );
}