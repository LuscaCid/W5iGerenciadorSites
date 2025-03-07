import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { ChevronRight } from "lucide-react";
import { MobileHeader } from "../components/MobileHeader";

const locationDictionary : Record<string, string>= {
    '/' : 'Página inicial',
    '/noticias' : 'Noticias',
    '/governo' : 'Governo',
    '/municipio' : 'Município',

}

/**
 * @summary Este componente tsx vai estabelecer o layout em relacao ao header e footer 
 * @author Lucas Cid
 * @created 27/02/2025
 */
export function Main () 
{
    const path = useLocation();
    return (
        <section className="h-full flex flex-col justify-between">
            <Header />
            <MobileHeader />
            <main className=" bg-zinc-100 absolute top-17 flex flex-col justify-between  md:top-23 bottom-48 h-screen right-0 left-0 ">
                <section className="px-6 md:px-44">
                <span className="text-sm w-fit border-b py-2 my-10 select-none hover border-zinc-200 flex items-center gap-2"> 
                    <ChevronRight size={15}/>
                    {locationDictionary[path.pathname]} 
                </span>
                <Outlet />
                </section>
                <footer className=" bottom-0 px-6 w-full self-end bg-orange-200 md:px-50 z-20 md:py-14 py-4">
                    footer
                    {/* links, redirecionamentos */}
                </footer>         
            </main>
        </section>
    );
}
/**
 *  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
    <script>
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    </script> 
 */