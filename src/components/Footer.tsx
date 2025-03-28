import {HeaderSearchDialog} from "./Dialogs/HeaderSearchDialog.tsx";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useLinks} from "../hooks/useLinks.ts";
import {Link} from "react-router-dom";
import {HookFormInput} from "../UI/FormInput.tsx";
import z from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "../UI/Button.tsx";
import {ArrowRight} from "lucide-react";

const contactSchema = z.object({
    ds_mensagem : z.string().min(2, "A mensagem precisa ter ao menos 2 caracteres")
})
type ContactSchema = z.infer<typeof contactSchema>;

export const Footer = () => {
    const [ isSearchWindowOpen, setSearchWindowOpen ] = useState(false);
    const { getLinks } = useLinks();
    const methods = useForm<ContactSchema>({ resolver : zodResolver(contactSchema) });
    const { data : links } = useQuery({
        queryFn : async () => await getLinks(),
        queryKey : ["links"]
    })

    const handleSubmitContactForm = (data : ContactSchema) => {
        console.log(data);
    }
    return (
        <footer
            id={"footer"}
            className=" bottom-0 px-6 w-full self-end bg-zinc-200 dark:bg-zinc-800 dark:border-t dark:border-zinc-600 md:px-50 z-20 md:py-10 py-4  flex flex-col "
        >
            <header className={"flex items-center w-full gap-4"}>
                <HeaderSearchDialog
                    setIsSearchWindowOpen={setSearchWindowOpen}
                    isSearchWindowOpen={isSearchWindowOpen}
                />
                <h4 className={"border-l border-zinc-400 px-4 text-2xl font-bold text-zinc-600 dark:text-zinc-400"}>
                    Links úteis
                </h4>

            </header>
            <main className={"flex flex-col lg:flex-row gap-4"}>
                <ul className={"grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 w-full gap-3 lg:1/2 2xl:w-2/3 "}>
                    <Link
                        target={"_self"}
                        className={"hover:bg-zinc-300 h-fit dark:hover:bg-zinc-900 hover:underline transition rounded-lg px-3 py-2 duration-200"}
                        to={"/governo"}>
                        {"Governo"}
                    </Link>
                    <Link
                        target={"_self"}
                        className={"hover:bg-zinc-300 h-fit dark:hover:bg-zinc-900 hover:underline transition rounded-lg px-3 py-2 duration-200"}
                        to={"/noticias"}>
                        {"Notícias"}
                    </Link>
                    <Link
                        target={"_self"}
                        className={"hover:bg-zinc-300 h-fit dark:hover:bg-zinc-900 hover:underline transition rounded-lg px-3 py-2 duration-200"}
                        to={"/municipio"}>
                        {"Município"}
                    </Link>
                    {
                        links && links.length > 0 && (
                            links.map((link) => (
                                <Link
                                    key={link.id_link}
                                    target={"_blank"}
                                    className={"hover:bg-zinc-300 hover:underline flex h-fit items-center transition rounded-lg px-3 py-2 duration-200 dark:hover:bg-zinc-900"}
                                    to={link.url_link}>
                                    {link.nm_link}
                                </Link>
                            ))
                        )
                    }
                </ul>
                <div className={"h-full w-[1px] bg-zinc-300 dark:bg-zinc-700 "}/>
                <aside className={"w-full lg:1/2 2xl:w-1/3 "}>
                    <FormProvider {...methods}>
                        <form
                            className={"w-full flex flex-col h-full gap-10 justify-between"}
                            onSubmit={methods.handleSubmit(handleSubmitContactForm)}
                        >
                            <h3 className={"text-2xl font-bold py-2 border-b border-zinc-300 dark:border-zinc-700"}>
                                Contato
                            </h3>
                            <HookFormInput<keyof ContactSchema>
                                label={"Envie uma mensagem"}
                                id={"ds_mensagem"}
                                className={"w-full bg-zinc-100"}
                                name={"ds_mensagem"}
                                placeholder={"Conteúdo da mensagem..."}
                            />
                            <Button
                                title={"Enviar"}
                                icon={ArrowRight}
                                type={"submit"}
                                className={"w-fit self-start lg:self-end"}
                                description={"Clique para enviar uma mensagem para nós"}
                            />
                        </form>
                    </FormProvider>
                </aside>
            </main>
        </footer>
    )
}