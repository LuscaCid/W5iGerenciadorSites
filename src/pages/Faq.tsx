import {useUserContext} from "../store/user.ts";
import {useFaqs} from "../hooks/useFaqs.ts";
import {useQuery} from "@tanstack/react-query";
import {FormCreateFaq} from "../components/FormCreateFaq.tsx";
import {memo, useCallback, useState} from "react";
import {Faq as FaqType} from "../@types/Faq";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {ChevronUp, Search} from "lucide-react";
import {Title} from "../components/Title.tsx";
import {Button} from "../UI/Button.tsx";
import {useSearchParams} from "react-router-dom";
import {Input} from "../UI/Input.tsx";

export const Faq = memo(() => {
    const user = useUserContext(state => state.user);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { getFaqs } = useFaqs();
    const [faqToEdit, setFaqToEdit ]= useState<FaqType|undefined>();
    const [ query, setQuery ] = useState("");
    const { data, isLoading } = useQuery({
        queryFn : async () => await getFaqs(),
        queryKey : ["faqs"]
    })
    const handleSetFaqToEdit = useCallback((faq : FaqType) => {
        setFaqToEdit(faq)
    }, [faqToEdit]);

    return (
        <section className={"flex flex-col lg:flex-row gap-4 mb-5"}>
            {
                user && (
                    <FormCreateFaq faqToEdit={faqToEdit}/>
                )
            }
            <main className={"flex flex-col gap-2 w-full lg:w-2/3"}>
                <Input
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    placeholder={"Pesquisar por alguma pergunta"}
                    icon={Search}
                />
                <Accordion className="!dark:bg-zinc-700 !bg-zinc-100 p-1 shadow-md w-full h-fit" >
                    <AccordionSummary
                        className="dark:bg-zinc-800 bg-zinc-500 rounded-t group"
                        expandIcon={<ChevronUp className="dark:text-zinc-50"/>}
                        id={"Perguntas"}
                    >
                        <Title title={"Perguntas"} id={"Perguntas"}/>
                    </AccordionSummary>
                    <AccordionDetails className="dark:text-zinc-50 lg:w-2/3 sm:w-full flex flex-col gap-1">
                        {
                            !isLoading && data && data.length > 0 && (
                                data.map((faq) => (
                                    <ValueShow
                                        handleSetFaqToEdit={handleSetFaqToEdit}
                                        key={faq.id_faq}
                                        faq={faq}
                                    />
                                ))
                            )
                        }
                        {
                            !isLoading && data.length == 0 && (
                                <span className={"text-zinc-700 dark:text-zinc-600 font-bold text-lg"}>
                                Nenhuma pergunta encontrada
                            </span>
                            )
                        }

                    </AccordionDetails>
                </Accordion>
            </main>

        </section>
    );
})
interface ValueShowProps {
    handleSetFaqToEdit : (faq : FaqType) => void;
    faq : FaqType;
}
function ValueShow (props : ValueShowProps) {
    return (
        <section className="pb-1 border-b border-zinc-300 dark:border-zinc-600 flex w-full justify-between">
            <Button onClick={() => props.handleSetFaqToEdit(props.faq)}/>
            <strong className="font-bold text-zinc-900 dark:text-zinc-50">
                {props.faq.ds_questao}
            </strong>
            <span className="text-zinc-600 dark:text-zinc-400 text-right">
                {props.faq.ds_resposta}
            </span>
        </section>
    );
}