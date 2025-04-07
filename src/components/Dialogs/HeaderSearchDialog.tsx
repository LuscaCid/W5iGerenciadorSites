import * as Dialog from "@radix-ui/react-dialog";
import {Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState} from "react";
import { TextButton } from "../../UI/TextButton.tsx";
import {ArrowUpRight, Search, X} from "lucide-react";
import {useQueryClient} from "@tanstack/react-query";
import {SiteDataReturn, useSite} from "../../hooks/useSite.ts";
import {DialogTitle} from "@radix-ui/react-dialog";
import {Link, NavLink} from "react-router-dom";

interface Props {
    setIsSearchWindowOpen : Dispatch<SetStateAction<boolean>>;
    isSearchWindowOpen: boolean;
    isMobile? : boolean;
    customTrigger? : ReactNode;
}

export function HeaderSearchDialog ({ isSearchWindowOpen, setIsSearchWindowOpen, isMobile, customTrigger } : Props)
{
    const [ query, setQuery ] = useState("");
    const queryClient = useQueryClient();
    const { getAllSiteData } = useSite();
    const [ data, setData ] = useState<SiteDataReturn|undefined>();
    // const [ searchParams, setSearchParams ] = useSearchParams();

    const handleSearch = useCallback(async () => {
        const data = await getAllSiteData(query);
        setData(data);
        // navigate("/noticias");
        // setIsSearchWindowOpen(false)

    }, [queryClient, setIsSearchWindowOpen, query, data]);

    useEffect(() => {
        async function dispatcher (e : KeyboardEvent)
        {
            if (e.key == "Enter" && isSearchWindowOpen) await handleSearch();
        }
        window.addEventListener("keypress", dispatcher );
        return () => window.removeEventListener("keypress", dispatcher );
    }, [ handleSearch, isSearchWindowOpen ]);
    const closeDialog = useCallback(() => {
        setIsSearchWindowOpen(false);
    }, [isSearchWindowOpen]);
    return (
    <Dialog.Root onOpenChange={setIsSearchWindowOpen} open={isSearchWindowOpen} modal={true}>
        <Dialog.Trigger asChild>
            {
                customTrigger ? (
                    <div>
                        {customTrigger}
                    </div>
                    ) : (

                    <TextButton
                        className={`${isMobile ? "bg-zinc-100 dark:bg-zinc-700 w-full items-center justify-center " : ""} hover:bg-blue-200 dark:hover:bg-blue-500 transition duration-150 py-9.5 px-10`}
                        onClick={ () => setIsSearchWindowOpen(!isSearchWindowOpen) }
                        icon={Search}
                        iconSize={20}
                    />
                )
            }
        </Dialog.Trigger>
        {/* a busca será realizada com base nas noticias encontradas com aquela informação passada */}
        <Dialog.Portal >
            <Dialog.Overlay className="z-50 fixed inset-0 transition duration-150 w-screen bg-zinc-900/30 backdrop-blur-md"/>
            <Dialog.Content className="z-[100] fixed w-screen left-0 top-0 right-0 bottom-0 overflow-hidden bg-zinc-900/40  ">
                <header className="flex items-center bg-zinc-100">
                    <DialogTitle className={"sr-only"}>
                        Buscar resultados
                    </DialogTitle>
                    <div className="items-center flex px-10 w-full border-b border-zinc-100 ">
                        <Search />
                        <input
                            onChange={(e) => setQuery(e.target.value)}
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
                <main className="m-auto mb-6 w-[95%] lg:w-full flex flex-col gap-2 px:2 md:px-44 2xl:px-76 lg:px-64 overflow-y-auto max-h-[90%]">
                    <span className="text-lg text-zinc-50  h-fit w-full m-auto opacity-70 select-none">
                        pressione 'esc' para fechar ou 'enter' para realizar uma busca
                    </span>
                    <section className={"rounded-lg bg-zinc-300 p-4 dark:bg-zinc-800 dark:text-zinc-100 font-bold"}>
                        <h3 className={"mb-4  text-2xl"}>Resultados</h3>

                        <footer className={"flex flex-col gap-5"}>
                            {
                                data && data.news.length > 0 && (
                                    <div className={"flex flex-col gap-2"}>
                                        <h4 className={"font-normal border-b p-2 border-zinc-100 dark:border-b-zinc-700 w-full"}>Notícias</h4>
                                        {
                                            data.news.map((news) => (
                                                <ListSearchItem
                                                    key={news.id_noticia}
                                                    title={news.nm_titulo}
                                                    subtitle={news.ds_subtitulo}
                                                    to={`/noticia/${news.id_noticia}`}
                                                    imagePreview={news.url_thumbimg}
                                                    closeDialog={closeDialog}
                                                />
                                                )
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                data && data.faqs.length > 0 && (
                                    <div className={"flex flex-col gap-2"}>
                                        <h4 className={"font-normal border-b p-2 border-zinc-100 dark:border-b-zinc-700 w-full"}>Perguntas frequentes</h4>
                                        {
                                            data.faqs.map((faq) => (
                                                <ListSearchItem
                                                    key={faq.id_faq}
                                                    title={faq.ds_questao}
                                                    subtitle={faq.ds_resposta}
                                                    closeDialog={closeDialog}
                                                />
                                                )
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                data && data.links.length > 0 && (
                                    <div className={"flex flex-col gap-2"}>
                                        <h4 className={"font-normal border-b p-2 border-zinc-100 dark:border-b-zinc-700 w-full"}>Serviços</h4>
                                        {
                                            data.links.map((faq) => (
                                                <ListSearchItem
                                                    key={faq.id_link}
                                                    title={faq.nm_link}
                                                    subtitle={faq.url_link}
                                                    closeDialog={closeDialog}
                                                    redirectOutside
                                                    to={faq.url_link}
                                                />
                                                )
                                            )
                                        }
                                    </div>
                                )
                            }
                        </footer>
                    </section>
                </main>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
    );
}
interface ListSearchProps {
    title : string;
    to? : string;
    imagePreview? : string;
    subtitle? : string;
    closeDialog : () => void;
    redirectOutside? : boolean;
}
const ListSearchItem = ({ title, subtitle, imagePreview, to, closeDialog, redirectOutside } : ListSearchProps) => {
    if (redirectOutside) {
        return (
            <Link target={"_blank"}
                to={to ?? "/"}
                onClick={closeDialog}
                className={"rounded-lg group relative bg-zinc-100 justify-between dark:border border-zinc-700 flex items-center gap-4 p-4 pr-7 hover:bg-zinc-300 hover:dark:bg-zinc-950 cursor-pointer dark:bg-zinc-900 transition duration-150"}
            >
                <LinkBody
                    title={title}
                    subtitle={subtitle}
                    imagePreview={imagePreview}
                />
                <ArrowUpRight className={"group-hover:translate-x-2 group-hover:-translate-y-1 transition duration-150"}/>
            </Link>
        )
    }
    return (
        <NavLink
            to={to ?? "/"}
            onClick={closeDialog}
            className={"rounded-lg group relative bg-zinc-100 justify-between dark:border border-zinc-700 flex items-center gap-4 p-4 pr-7 hover:bg-zinc-300 hover:dark:bg-zinc-950 cursor-pointer dark:bg-zinc-900 transition duration-150"}
        >
            <LinkBody
                title={title}
                subtitle={subtitle}
                imagePreview={imagePreview}
            />
            <ArrowUpRight className={"group-hover:translate-x-2 group-hover:-translate-y-1 transition duration-150"}/>
        </NavLink>
    )
}
interface LinkBodyProps {
    title : string;
    imagePreview? : string;
    subtitle? : string;
}
const LinkBody = ({imagePreview, title, subtitle} : LinkBodyProps) => {
    return (
        <aside className={"flex gap-4 "}>
            {imagePreview && (
                <img src={imagePreview} alt={"Imagem para pré visualizar"} className={"w-[100px] h-[50px] rounded-md"}/>
            )}
            <main className={"flex flex-col "}>
                <h3 className={"text-lg font-semibold text-zinc-50 dark:text-zinc-300 overflow-ellipsis overflow-hidden text-nowrap w-full max-w-[90%] md:max-w-[300px] lg:max-w-[500px] 2xl:max-w-[650px]"}>
                    {title}
                </h3>
                {subtitle && (
                    <span className={"text-sm text-zinc-200 dark:text-zinc-400"}>
                        {subtitle}
                    </span>
                )}
            </main>

        </aside>
    )
}