import {HeaderSearchDialog} from "./Dialogs/HeaderSearchDialog.tsx";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useLinks} from "../hooks/useLinks.ts";
import {Link} from "react-router-dom";
import {HookFormInput} from "../UI/FormInput.tsx";
import z from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

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
        <footer className=" bottom-0 px-6 w-full self-end bg-zinc-200 md:px-50 z-20 md:py-14 py-4  flex flex-col ">
            <header className={"flex items-center w-full gap-4"}>
                <HeaderSearchDialog
                    setIsSearchWindowOpen={setSearchWindowOpen}
                    isSearchWindowOpen={isSearchWindowOpen}
                />
                <h4 className={"border-l border-zinc-400 px-4 text-2xl font-bold text-zinc-600"}>
                    Links úteis
                </h4>

            </header>
            <ul className={"grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 w-full gap-3 "}>
                <Link
                    target={"_self"}
                    className={"hover:bg-zinc-200 hover:underline transition rounded-lg px-2 py-1 duration-200"}
                    to={"/governo"}>
                    {"Governo"}
                </Link>
                <Link
                    target={"_self"}
                    className={"hover:bg-zinc-200 hover:underline transition rounded-lg px-2 py-1 duration-200"}
                    to={"/noticias"}>
                    {"Notícias"}
                </Link>
                <Link
                    target={"_self"}
                    className={"hover:bg-zinc-200 hover:underline transition rounded-lg px-2 py-1 duration-200"}
                    to={"/municipio"}>
                    {"Município"}
                </Link>
                {
                    links && links.length > 0 && (
                        links.map((link) => (
                            <Link
                                key={link.id_link}
                                target={"_blank"}
                                className={"hover:bg-zinc-200 hover:underline transition rounded-lg px-2 py-1 duration-200"}
                                to={link.url_link}>
                                {link.nm_link}
                            </Link>
                        ))
                    )
                }
            </ul>
            <aside>
                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(handleSubmitContactForm)}
                    >
                        <HookFormInput<keyof ContactSchema>
                            id={"ds_mensagem"}
                            name={"ds_mensagem"}
                        />
                    </form>
                </FormProvider>
            </aside>
        </footer>
    )
}