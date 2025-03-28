import * as Dialog from "@radix-ui/react-dialog";
import {Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState} from "react";
import { TextButton } from "../../UI/TextButton.tsx";
import { Search, X } from "lucide-react";
import {useNewsTagsContext} from "../../store/newsTags.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    // const [ searchParams, setSearchParams ] = useSearchParams();

    const handleSearch = useCallback( async () => {
        // setSearchParams({ nm_titulo : query});
        setTitle(query);
        await queryClient.invalidateQueries({queryKey : ['news']});
        navigate("/noticias");
        setIsSearchWindowOpen(false)

    }, [queryClient, setIsSearchWindowOpen, query]);

    useEffect(() => {
        async function dispatcher (e : KeyboardEvent)
        {
            if (e.key == "Enter" && isSearchWindowOpen) await handleSearch();
        }
        window.addEventListener("keypress", dispatcher );
        return () => window.removeEventListener("keypress", dispatcher );
    }, [ handleSearch, isSearchWindowOpen ]);

    return (
    <Dialog.Root onOpenChange={setIsSearchWindowOpen} open={isSearchWindowOpen}>
        <Dialog.Trigger asChild>
            {
                customTrigger ? (
                    <>
                        {customTrigger}
                    </>
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
            <Dialog.Content className="z-[100] fixed w-screen left-0 top-0 right-0 overflow-hidden bg-zinc-900/60 ">
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
                <main className="m-auto w-fit ">
                    <span className="text-lg text-zinc-50  opacity-70 select-none">
                        pressione 'esc' para fechar ou 'enter' para realizar uma busca
                    </span>
                </main>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
    );
}