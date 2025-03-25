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
    'login' : 'Acesso administrativo'
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
        <section className="h-screen flex flex-col justify-between  ">
            <Header />
            <MobileHeader />
            <main className="absolute  top-17 flex flex-col justify-between  md:top-23 bottom-48 h-screen right-0 left-0 ">
                <section className="px-2 md:px-40 2xl:px-56">
                    <span className="text-lg font-semibold w-fit border-b py-2 my-3 select-none hover border-zinc-200 flex items-center gap-2">
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