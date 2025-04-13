import {useSearchParams} from "react-router-dom";
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
import {SecretariatDepartment} from "../@types/SecretariatDepartment";

export const SecretariatPage = memo(() => {
    const queryClient = useQueryClient();
    const openToast = useContextSelector(toastContext, (s) => s.open);
    const user = useUserContext(state => state.user);
    const [ secretariatToEdit, setSecretariatToEdit ] = useState<Secretariat|undefined>(undefined);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const { getSecretariats, deleteSecretariat } = useSecretariat();
    const [ page, setPage ] = useState<number>(1);
    const [ query, setQuery ] = useState("");
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
    const paginateBackwardsForwards = useCallback(async (dir : PaginationDirection ) => {
        setPage(dir == "backwards" ? (page => page - 1) : (page => page + 1));
        setSearchParams(prev => {
            const p = (dir == "backwards" ? (page - 1) : (page + 1))
            prev.set("page", p.toString())
            return prev;
        });

    }, [searchParams,page]);

    const handleSetSecretariatToEdit = useCallback((secretariat : Secretariat) => {
        setSecretariatToEdit(secretariat);
        setIsDialogOpen(true);
    },[secretariatToEdit])

    const handleDeleteSecretariat = useCallback(async(secretariat : Secretariat) => {
        await deleteSecretariatAsync(secretariat.id_secretariat!)
    }, [secretariatToEdit]);
    useEffect(() => {
        queryClient.invalidateQueries({queryKey : ["get-secretariat"]});
    }, [page]);

    useEffect(() => {
        if (query)
        {
            setDebounce(true);
            const timeout = setTimeout(() => setDebounce(false), 500);
            return () => clearTimeout(timeout);
        }
        queryClient.invalidateQueries({queryKey : ["get-secretariat"]});
        setDebounce(false);
    }, [query, queryClient]);

    useEffect(() => {
        if(!isDialogOpen) setSecretariatToEdit(undefined);
    }, [isDialogOpen]);

    useEffect(() => {
        if (!debounce)
        {
            queryClient.invalidateQueries({queryKey : ["get-secretariat"]});
        }
    }, [ debounce, queryClient, searchParams ]);
    return (
        <section className={"flex flex-col gap-4 my-20 h-full"}>
            <header className={'flex items-center justify-between lg:flex-row flex-col gap-2'}>
                <Input
                    placeholder={"Pesquisar por secretarias"}
                    className={"w-full lg:w-2/3 2xl:w-1/3"}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setSearchParams(prev => {
                            prev.set("query", e.target.value);
                            return prev;
                        })
                    }}
                    value={query}
                    icon={Search}
                />
                {
                    user && (
                        <Dialog.Root
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <Dialog.Trigger asChild>
                                <Button
                                    className={" self-end "}
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
                <aside className="w-full lg:w-fit flex justify-between items-center gap-2 self-end ">
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
            <main className={"flex flex-col w-full gap-2"}>
                {
                    !isLoading && data && data.length > 0 && (
                        data.map((secretariat : Secretariat) =>(
                            <Accordion key={secretariat.id_secretariat} className="dark:bg-zinc-800 bg-zinc-100 p-1 shadow-md w-full h-fit" >
                                <AccordionSummary
                                    className=" dark:bg-zinc-900 bg-zinc-200 rounded-t group dark:text-zinc-100 "
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
                                        children={
                                            <div className={"flex flex-col gap-2 dark:text-zinc-100"}>
                                                <header className={"flex gap-5 items-center"}>
                                                    {
                                                        secretariat.secretariatImage && (
                                                            <img
                                                                className={"w-[100px] h-[100px] lg:max-w-[250px] lg:max-h-[250px] lg:h-[250px]  lg:w-full rounded-full object-cover"}
                                                                src={secretariat.secretariatImage.url}
                                                                alt={"Imagem do secretario responsável"}
                                                            />
                                                        )
                                                    }
                                                    <aside className={"flex flex-col gap-1"}>
                                                    <span className={"text-2xl font-bold"}>
                                                        {secretariat.nm_secretary}
                                                    </span>
                                                        <p>
                                                            Sobre o secretario: {secretariat.ds_about}
                                                        </p>
                                                    </aside>

                                                </header>
                                                <span>Endereço: {secretariat.ds_address}</span>
                                                <span>Telefone: {secretariat.nu_phone}</span>
                                                {
                                                    secretariat.organizationalChart && (
                                                        <section className={"flex flex-col gap-2"}>
                                                            <h3 className={"text-2xl font-bold"}>
                                                                Organograma
                                                            </h3>
                                                            <img
                                                                className={" lg:max-w-[600px] w-full rounded-lg object-cover"}
                                                                src={secretariat.organizationalChart.url ?? ""}
                                                                alt={"Imagem do organograma da secretaria"}
                                                            />
                                                        </section>
                                                    )
                                                }
                                            </div>
                                        }
                                    />
                                    <h3 className={"font-bold text-2xl my-2 dark:text-zinc-300"}>
                                        Departamentos
                                    </h3>
                                    <footer
                                        className={"flex flex-col gap-2"}
                                    >
                                        {
                                            secretariat.secretariatDepartments && secretariat.secretariatDepartments.length > 0 && secretariat.secretariatDepartments.map(
                                                (dp : SecretariatDepartment) => (
                                                    <div key={dp.id_department} className={" bg-zinc-200 dark:bg-zinc-700 lg:w-1/2 2xl:w-1/2  p-4 rounded-lg text-zinc-900 dark:text-zinc-300 text-lg flex flex-col gap-2"}>
                                                        <main className={"flex flex-col gap-5"}>
                                                            <header className={"flex flex-col gap-1"}>
                                                                {dp.nm_department}
                                                                {dp.ds_about}
                                                            </header>
                                                            <footer className={"flex flex-col"}>
                                                                <h3 className={"text-lg font-bold border-b border-zinc-300 dark:border-zinc-600 mb-2"}>
                                                                    Informações de contato
                                                                </h3>
                                                                <span className={"py-1 border-b border-zinc-300 dark:border-zinc-600"}> E-mail: {dp.nm_email} </span>
                                                                <span className={"py-1 border-b border-zinc-300 dark:border-zinc-600"}> Endereço: {dp.ds_address} </span>
                                                                <span className={"py-1 border-b border-zinc-300 dark:border-zinc-600"}> Atribuições: {dp.ds_address} </span>
                                                                <span className={"py-1 border-b border-zinc-300 dark:border-zinc-600"}> Telefone: {dp.nu_phone} </span>
                                                            </footer>
                                                        </main>
                                                    </div>
                                                )
                                            )
                                        }
                                    </footer>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )
                }
                {
                    !isLoading && data && data.length == 0 && (
                        <span className={"text-2xl font-bold dark:text-zinc-500"}>
                        Nenhuma secretaria foi encontrada
                    </span>
                    )
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
            </main>
        </section>
    )
})