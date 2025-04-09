import {useParams, useSearchParams} from "react-router-dom";
import {memo, useCallback, useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useSecretariat} from "../hooks/useSecretariat.ts";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "../components/Toast.tsx";
import {Secretariat} from "../@types/Secretariat";
import {Accordion, AccordionDetails, AccordionSummary, Skeleton} from "@mui/material";
import {ArrowLeft, ArrowRight, ChevronUp, Search} from "lucide-react";
import {useUserContext} from "../store/user.ts";
import {AccordionValueShow} from "../components/AccordionValueShow.tsx";
import {CustomOverlay} from "../components/Dialogs/CustomOverlay.tsx";
import {FormCreateSecretariat} from "../components/Dialogs/FormCreateSecretariat.tsx";
import { Dialog } from "radix-ui"
import {Button} from "../UI/Button.tsx";
import {PaginationDirection} from "./News.tsx";
import {Input} from "../UI/Input.tsx";
export const SecretariatPage = memo(() => {
    const queryClient = useQueryClient();
    const openToast = useContextSelector(toastContext, (s) => s.open);
    const user = useUserContext(state => state.user);
    const [ secretariatToEdit, setSecretariatToEdit ] = useState<Secretariat|undefined>();
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const { getSecretariats, deleteSecretariat } = useSecretariat();
    const [ page, setPage ] = useState<number>(1);
    const [ query, setquery ] = useState("");
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ debounce, setDebounce ] = useState(false);

    const { data, isLoading } = useQuery({
        queryFn : async () => await getSecretariats(),
        queryKey : ["get-secretariat"],
        refetchOnWindowFocus : false,
    });
    const { mutateAsync : deleteSecretariatAsync } = useMutation({
        mutationFn : deleteSecretariat,
        onSuccess : (_, variables) => {
            openToast("Secretaria excluída");
            queryClient.setQueryData(
                ["get-secretariat"],
                (prev : Secretariat[]) => prev.filter((s) => s.id_secretariat != variables)
            )
        },
        onError: () => openToast("Ocorreu algum problema, tente novamente mais tarde", "error")
    });
    const paginateBackwardsForwards = useCallback((dir : PaginationDirection ) => {
        setPage(dir == "backwards" ? (page => page - 1) : (page => page + 1));
        setSearchParams(prev => {
            const p = (dir == "backwards" ? (page - 1) : (page + 1))
            prev.set("pag", p.toString())
            return prev;
        });
    }, [searchParams,page]);

    const handleSetSecretariatToEdit = useCallback((secretariat : Secretariat) => {
        setSecretariatToEdit(secretariat);
    },[secretariatToEdit])

    const handleDeleteSecretariat = useCallback(async(secretariat : Secretariat) => {
        await deleteSecretariatAsync(secretariat.id_secretariat!)
    }, [secretariatToEdit]);

    useEffect(() => {
        if (query) {
            setDebounce(true);
            const timeout = setTimeout(() => setDebounce(false), 500);
            return () => clearTimeout(timeout);
        }
        setDebounce(false);
    }, [debounce, query]);

    useEffect(() => {
        if (!debounce){
            queryClient.invalidateQueries({queryKey : ["get-secretariat"]})
        }
    }, [debounce]);
    return (
        <section className={"flex flex-col gap-4 my-20"}>
            <header className={'flex items-center justify-between '}>
                <Input
                    placeholder={"Pesquisar por secretarias"}
                    className={"w-1/3"}
                    onChange={(e) => setquery(e.target.value)}
                    value={query}
                    icon={Search}
                />
                {
                    user && (
                        <Dialog.Root
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                            modal={true}
                        >
                            <Dialog.Trigger asChild>
                                <Button
                                    className={"mr-2"}
                                    title={"Novo"}
                                />
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <CustomOverlay/>
                                <FormCreateSecretariat secretariatData={secretariatToEdit}/>
                            </Dialog.Portal>
                        </Dialog.Root>
                    )
                }
                <aside className="w-fit flex justify-between items-center gap-2 self-end ">
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
                        disabled={data &&  data.length == 0}
                    />
                </aside>
            </header>

            {
                !isLoading && data && data.length > 0 && (
                    data.map((secretariat : Secretariat) =>(
                        <Accordion className="dark:bg-zinc-700 bg-zinc-100 p-1 shadow-md w-full h-fit" >
                            <AccordionSummary
                                className=" dark:bg-zinc-800 bg-zinc-200 rounded-t group dark:text-zinc-100 "
                                expandIcon={<ChevronUp className="text-zinc-800 dark:text-zinc-100"/>}
                                id={secretariat.id_secretariat!.toString()}
                            >
                                <h4 className={"text-semibold text-lg text-zinc-800 dark:text-zinc-100 "}>
                                    {secretariat.nm_secretariat}
                                </h4>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AccordionValueShow<Secretariat>
                                    isAdminInUse={user != undefined}
                                    handleDelete={handleDeleteSecretariat}
                                    handleSetToEdit={handleSetSecretariatToEdit}
                                    object={secretariat}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))
                )
            }
            {
                !isLoading && data && data.length == 0
            }
            {
                isLoading && (
                    <div className={"flex flex-col gap-2"}>
                        {
                            Array.from({length : 5}).map(() => (
                                <Skeleton
                                    variant={"rectangular"}
                                    animation={"wave"}
                                    className={"h-[130px] rounded-lg w-full bg-zinc-200 dark:bg-zinc-800"}
                                />
                            ))
                        }
                    </div>

                )
            }

        </section>
    )
})