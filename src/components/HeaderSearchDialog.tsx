import * as Dialog from "@radix-ui/react-dialog";
import { SetStateAction } from "react";
import { TextButton } from "../UI/TextButton";
import { Search, X } from "lucide-react";

interface Props {
    setIsSearchWindowOpen : React.Dispatch<SetStateAction<boolean>>;
    isSearchWindowOpen: boolean;
    isMobile? : boolean; 
}
export function HeaderSearchDialog ({ isSearchWindowOpen, setIsSearchWindowOpen, isMobile } : Props) 
{
    return (
    <Dialog.Root onOpenChange={setIsSearchWindowOpen} open={isSearchWindowOpen}>
        <Dialog.Trigger asChild>
            <TextButton 
                className={`${isMobile ? "bg-zinc-100 w-full items-center justify-center " : ""} hover:bg-blue-200 transition duration-150 py-9.5 px-10`}
                onClick={ () => setIsSearchWindowOpen(!isSearchWindowOpen) }
                icon={Search}
                iconSize={20}
            />
        </Dialog.Trigger>
        {/* a busca será realizada com base nas noticias encontradas com aquela informação passada */}
            <Dialog.Portal >
                <Dialog.Overlay className="z-50 fixed inset-0 w-screen bg-zinc-900/30 backdrop-blur-md"/>
                <Dialog.Content className="z-[100] fixed w-screen left-0 top-0 right-0 overflow-hidden bg-zinc-900/60 ">
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
                    <span className="text-lg text-zinc-50  opacity-70 select-none">
                        pressione 'esc' para fechar ou 'enter' para realizar uma busca
                    </span>
                    </main>
                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root>
    );
}