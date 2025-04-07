import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { ChevronRight } from "lucide-react";
import { MobileHeader } from "../components/MobileHeader";
import BackToTop from "../components/BackToTop";
import { useEffect } from "react";
import {Footer} from "../components/Footer.tsx";

export const locationDictionary : Record<string, string>= {
    '' : 'Página inicial',
    'noticias' : 'Notícias',
    'governo' : 'Governo',
    'municipio' : 'Município',
    'noticia' : 'Home → Notícia',
    'login' : 'Acesso administrativo',
    'faq' : "Perguntas Frequentes"
}

/**
 * @summary Este componente tsx vai estabelecer o layout em relacao ao header e footer 
 * @author Lucas Cid
 * @created 27/02/2025
 */
export function Main () 
{

    const path = useLocation();
    const pathDictionary= path.pathname.split('/')[1];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [path])
    return (
        <section className="h-screen flex flex-col justify-between relative dark:text-zinc-200 dark:bg-zinc-900">
            <Header isHomePage={pathDictionary == ""}/>
            <MobileHeader />
            <main className={`absolute  top-17 ${pathDictionary == "" ? "md:top-40" : "md:top-28"}  flex flex-col justify-between  transition duration-150 bottom-48 h-screen right-0 left-0 `}>
                <section className="px-4 md:px-40 2xl:px-56 dark:bg-zinc-900">
                    <span className="text-lg font-semibold w-fit border-b py-2 my-3 mb-5 select-none hover border-zinc-200 dark:border-b-zinc-700 flex items-center gap-2">
                        <ChevronRight size={20}/>
                        {locationDictionary[pathDictionary]}
                    </span>
                    <Outlet />
                    </section>
                <Footer />
            </main>
            <BackToTop />
        </section>
    );
}