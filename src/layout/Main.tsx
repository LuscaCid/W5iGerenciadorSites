import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { ChevronRight } from "lucide-react";
import { MobileHeader } from "../components/MobileHeader";
import BackToTop from "../components/BackToTop";

export const locationDictionary : Record<string, string>= {
    '' : 'Página inicial',
    'noticias' : 'Noticias',
    'governo' : 'Governo',
    'municipio' : 'Município',
    'noticia' : 'Home -> Noticia detalhada',
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
    return (
        <section className="h-screen flex flex-col justify-between  ">
            <Header />
            <MobileHeader />
            <main className="absolute  top-17 flex flex-col justify-between  md:top-23 bottom-48 h-screen right-0 left-0 ">
                <section className="px-6 md:px-40 2xl:px-56">
                <span className="text-lg font-semibold w-fit border-b py-2 my-3 select-none hover border-zinc-200 flex items-center gap-2"> 
                    <ChevronRight size={20}/>
                    {locationDictionary[pathDictionary]} 
                </span>
                <Outlet />
                </section>
                <footer className=" bottom-0 px-6 w-full self-end bg-slate-200 md:px-50 z-20 md:py-14 py-4">
                    footer
                    {/* links, redirecionamentos */}
                </footer>         
            </main>
            <BackToTop />
        </section>
    );
}
/**
 *  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
    <script>
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    </script> 
 */