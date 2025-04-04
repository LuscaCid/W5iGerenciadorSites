import {useUserContext} from "../store/user.ts";
import {useFaqs} from "../hooks/useFaqs.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {FormCreateFaq} from "../components/FormCreateFaq.tsx";
import {memo, useCallback, useEffect, useState} from "react";
import {Faq as FaqType} from "../@types/Faq";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {ArrowLeft, ArrowRight, ChevronUp, Pencil, Search, Trash, X} from "lucide-react";
import {Button} from "../UI/Button.tsx";
import {useSearchParams} from "react-router-dom";
import {Input} from "../UI/Input.tsx";
import {toastContext} from "../components/Toast.tsx";
import {AxiosError} from "axios";
import {getAxiosErrorMessage} from "../utils/treatAxiosError.ts";
import {useContextSelector} from "use-context-selector";
import {PaginationDirection} from "./News.tsx";

export const Faq = memo(() => {
    const user = useUserContext(state => state.user);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { getFaqs, deleteFaq } = useFaqs();
    const [ page, setPage ] = useState<number>(1);

    const [faqToEdit, setFaqToEdit ]= useState<FaqType|undefined>();
    const openToast = useContextSelector(toastContext, (s) => s.open);
    const queryClient = useQueryClient();
    const [ debounce, setDebounce ] = useState(false);
    const [ query, setQuery ] = useState("");

    const { data, isLoading } = useQuery({
        queryFn : async () => await getFaqs(),
        queryKey : ["faqs"],
        refetchOnWindowFocus : false,
    });

    const { mutateAsync : deleteFaqAsync } = useMutation(({
        mutationFn : deleteFaq,
        mutationKey : ['delete-faq'],
        onSuccess: (_, variables) => {
            queryClient.setQueryData(["faqs"],(prev : FaqType[]) => prev.filter(faq => faq.id_faq != variables));
            openToast("Pergunta frequente excluída", "success");
        },
        onError : (err) => {
            if (err instanceof AxiosError) {
                const message = getAxiosErrorMessage(err);
                openToast(message, "error")
            }
        }
    }))

    const handleSetFaqToEdit = useCallback((faq : FaqType) => {
        setFaqToEdit(faq)
    }, [faqToEdit]);

    const handleDeleteFaq = useCallback(async(faq : FaqType) => {
        if (faqToEdit && faq.id_faq == faqToEdit.id_faq) setFaqToEdit(undefined);
        await deleteFaqAsync(faq.id_faq);
    }, [faqToEdit])

    const paginateBackwardsForwards = useCallback((dir : PaginationDirection ) => {
        setPage(dir == "backwards" ? (page => page - 1) : (page => page + 1));
    }, [page]);

    useEffect(() => {
        setSearchParams(
            prev => {
                prev.set("query", query)
                return prev;
            }
        )
        if (query)
        {
            setDebounce(true);
            const timeout = setTimeout(() => setDebounce(false), 500);
            return () => clearTimeout(timeout);
        }

        queryClient.invalidateQueries({queryKey : ["faqs"]});
        setDebounce(false);
    }, [query, queryClient]);

    useEffect(() => {
        if (page)
        {
            setSearchParams(prev => {
                prev.set("page", page.toString())
                return prev;
            })
            console.log("asdasdasdsada");
            queryClient.invalidateQueries({queryKey : ["faqs"]})
        }
    }, [page, searchParams, queryClient]);
    useEffect(() => {
        if (!debounce)
        {
            queryClient.invalidateQueries({queryKey : ["faqs"]});
        }
    }, [ debounce, queryClient ]);
    return (
    <section className={"flex flex-col lg:flex-row gap-4 mb-5 h-full"}>
    {
        user && (
            <FormCreateFaq setFaqToEdit={setFaqToEdit} faqToEdit={faqToEdit}/>
        )
    }
    {user && <div className={"w-full h-[1px] lg:h-full lg:w-[1px] bg-zinc-200  dark:bg-zinc-800"}/>}

    <main className={"flex flex-col gap-5 w-full lg:w-2/3"}>
        <header className={"flex items-center gap-4"}>
            <Input
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                placeholder={"Pesquisar por alguma pergunta"}
                icon={Search}
            />
            <Button
                className={"h-fit p-3"}
                icon={X}
                description={"Limpar consulta"}
                onClick={() => {
                    setQuery("");

                }}
            />
        </header>
        <h3 className={"text-2xl font-bold text-zinc-700 dark:text-zinc-400"}>
            Perguntas frequentes
        </h3>
            {/*a iteracao deve ter como filho o accordion summary para que o titulo do dropdown seja a pergunta*/}
            <main className={"flex flex-col gap-2"}>
                {
                    !isLoading && data.length > 0 && (
                        data.map((faq : FaqType) =>(
                            <Accordion className="dark:bg-zinc-700 bg-zinc-100 p-1 shadow-md w-full h-fit" >
                                <AccordionSummary
                                    className=" dark:bg-zinc-800 bg-zinc-200 rounded-t group dark:text-zinc-100 "
                                    expandIcon={<ChevronUp className="text-zinc-800 dark:text-zinc-100"/>}
                                    id={faq.id_faq.toString()}
                                >
                                    <h4 className={"text-semibold text-lg text-zinc-800 dark:text-zinc-100 "}>
                                        {faq.ds_questao}
                                    </h4>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ValueShow
                                        isAdminInUse={user != undefined}
                                        handleDeleteFaq={handleDeleteFaq}
                                        handleSetFaqToEdit={handleSetFaqToEdit}
                                        faq={faq}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )
                }
                {
                    !isLoading && data.length == 0 && (
                        <span className={"text-lg font-bold text-zinc-700 dark:text-zinc-500"}>Nenhuma pergunta frequente encontrada</span>
                    )
                }
            </main>
            <footer className="w-full flex justify-between items-center self-end">
                <Button
                    onClick={() => paginateBackwardsForwards('backwards')}
                    icon={ArrowLeft}
                    title="Anterior"
                    disabled={page == 1}
                />
                <Button
                    onClick={() => paginateBackwardsForwards('forwards')}
                    icon={ArrowRight}
                    title="Próxima"
                    className="flex-row-reverse"
                    disabled={data && data.length == 0}
                />
            </footer>
        </main>
    </section>
    );
})
interface ValueShowProps {
    handleSetFaqToEdit : (faq : FaqType) => void;
    handleDeleteFaq : (faq : FaqType) => void;
    faq : FaqType;
    isAdminInUse? : boolean;
}
function ValueShow (props : ValueShowProps) {
    return (
        <section className="pb-1 border-b border-zinc-300 dark:border-zinc-600 flex w-full flex items-center gap-5">
            {
                props.isAdminInUse && (
                    <>
                        <aside className={"flex items-center gap-1"}>
                            <Button
                                className={"rounded-full p-1 h-10 w-10 text-zinc-100 flex items-center justify-center  bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600" }
                                icon={Pencil}
                                onClick={() => props.handleSetFaqToEdit(props.faq)}
                            />
                            <Button
                                className={"rounded-full p-1 h-10 w-10 text-zinc-100 flex items-center justify-center  bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600" }
                                icon={Trash}
                                onClick={() => props.handleDeleteFaq(props.faq)}
                            />
                        </aside>
                        <div className={"h-10 bg-zinc-300 dark:bg-zinc-900 w-[1px]"}/>
                    </>
                )
            }
            <span className="text-zinc-600 dark:text-zinc-400  text-right">
                {props.faq.ds_resposta}
            </span>
        </section>
    );
}