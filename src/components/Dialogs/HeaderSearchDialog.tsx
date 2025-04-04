import * as Dialog from "@radix-ui/react-dialog";
import {Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState} from "react";
import { TextButton } from "../../UI/TextButton.tsx";
import {Search, X} from "lucide-react";
import {useNewsTagsContext} from "../../store/newsTags.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {SiteDataReturn, useSite} from "../../hooks/useSite.ts";

interface Props {
    setIsSearchWindowOpen : Dispatch<SetStateAction<boolean>>;
    isSearchWindowOpen: boolean;
    isMobile? : boolean;
    customTrigger? : ReactNode;
}

export function HeaderSearchDialog ({ isSearchWindowOpen, setIsSearchWindowOpen, isMobile, customTrigger } : Props)
{
    const setTitle = useNewsTagsContext((state) => state.setTitle);
    const [ query, setQuery ] = useState("");
    const queryClient = useQueryClient();
    const { getAllSiteData } = useSite();
    const [ data, setData ] = useState<SiteDataReturn|undefined>();
    // const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isLoading, setIsLoading ] = useState(false);

    const handleSearch = useCallback(async () => {
        setTitle(query);
        setIsLoading(true);
        const data = await getAllSiteData(query);
        setData(data);
        // navigate("/noticias");
        // setIsSearchWindowOpen(false)

    }, [queryClient, setIsSearchWindowOpen, query, isLoading, data]);

    useEffect(() => {
        async function dispatcher (e : KeyboardEvent)
        {
            if (e.key == "Enter" && isSearchWindowOpen) await handleSearch();
        }
        window.addEventListener("keypress", dispatcher );
        return () => window.removeEventListener("keypress", dispatcher );
    }, [ handleSearch, isSearchWindowOpen ]);

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
                <main className="m-auto w-fit w-[95%] lg:w-full flex flex-col gap-2 px:2 md:px-44 2xl:px-76 lg:px-64 overflow-y-scroll">
                    <span className="text-lg text-zinc-50  h-fit w-full m-auto opacity-70 select-none">
                        pressione 'esc' para fechar ou 'enter' para realizar uma busca
                    </span>
                    {/*TODO janela de demonstração de resultados de pesquisa em toda a aplicacao*/}
                    <section className={"rounded-lg bg-zinc-300 p-4 dark:bg-zinc-800 dark:text-zinc-100 font-bold"}>
                        <h3 className={"mb-4  text-2xl"}>Resultados</h3>

                        <footer className={"flex flex-col gap-2"}>
                            {
                                data && data.news.length > 0 && (
                                    data.news.map((news) => (
                                        <section key={news.id_noticia}>
                                            <ListSearchItem title={news.nm_titulo} subtitle={news.ds_subtitulo} to={""} imagePreview={news.url_thumbimg}/>
                                        </section>
                                        )
                                    )
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
    imagePreview? : string;
    title : string;
    to : string;
    subtitle? : string;
}
const ListSearchItem = ({ title, subtitle, imagePreview } : ListSearchProps) => {
    return (
        <section className={"rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:border border-zinc-700 flex items-center gap-4 p-2 hover:bg-zinc-300 hover:dark:bg-zinc-950 cursor-pointer dark:bg-zinc-900 transition duration-150"}>
            {imagePreview && (
                <img src={imagePreview} alt={"Imagem para pré visualizar"} className={"w-[100px] h-[50px]"}/>
            )}
            <aside className={"flex flex-col "}>
                <h3 className={"text-lg font-semibold text-zinc-50 dark:text-zinc-300"}>
                    {title}
                </h3>
                {subtitle && (
                    <span className={"text-sm text-zinc-200 dark:text-zinc-400"}>
                        {subtitle}
                    </span>
                )}
            </aside>
        </section>
    )
}