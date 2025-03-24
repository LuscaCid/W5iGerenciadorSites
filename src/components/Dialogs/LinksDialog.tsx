import {CustomDialogContent} from "../CustomDialogContent.tsx";
import {DialogTitle} from "@radix-ui/react-dialog";
import z from "zod";
import {useCallback, useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link} from "../../@types/Link";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {IconButton, TableFooter, Tooltip} from "@mui/material";
import {Ban, Check, Pencil, Trash} from "lucide-react";
import {Link as LinkNav} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useLinks} from "../../hooks/useLinks.ts";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "../Toast.tsx";
import {AxiosError} from "axios";
import {HookFormInput} from "../../UI/FormInput.tsx";
import {Switch} from "../Switch.tsx";
import {Button} from "../../UI/Button.tsx";
import {useSiteContext} from "../../store/site.ts";

const formSchema = z.object({
    nm_link : z.string().min(3, "É necessário informar como o link será apresentado"),
    url_link : z.string().min(5, "É necessário preencher a url"),
    fl_transparencia : z.boolean().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>

export const LinksDialog = () => {

    const [ linkToEdit, setLinkToEdit ] = useState<Link|undefined>(undefined);
    const queryClient = useQueryClient();

    const links = queryClient.getQueryData(['links']) as Link[] ?? [];

    const openToast = useContextSelector(toastContext, (c) => c.open);
    const { addLink, deleteLink } = useLinks();
    const site = useSiteContext((state) => state.site);
    const methods = useForm<FormSchemaType>({ resolver : zodResolver(formSchema) });
    const [ transparencyLink, setTransparencyLink ] = useState<Link|undefined>(undefined);
    const fl_transparenciaWatched = methods.watch("fl_transparencia");

    const { mutateAsync : deleteLinkAsync } = useMutation({
        mutationFn : deleteLink,
        mutationKey : ["delete-link"],
        onSuccess : (_, variables) => {
            openToast("Link excluído com sucesso", "success");
            queryClient.setQueryData(["links"], (prev : Link[]) => (
                prev.filter(prevLink => prevLink.id_link != variables)
            ))
        },
        onError : (err) => {
            if (err instanceof AxiosError && err.response)
                openToast((err.response.data as { message : string }).message, "error");
        }
    });
    const { mutateAsync : saveLinkAsync } = useMutation({
        mutationFn : addLink,
        mutationKey : ["save-link"],
        onSuccess : async () => {
            openToast("Link criado com sucesso", "success");
            methods.reset()
            methods.setValue("fl_transparencia", false);
            await queryClient.invalidateQueries({queryKey : ["links"]})

        },
        onError: (err : unknown) => {
            if (err instanceof AxiosError && err.response)
                openToast((err.response.data as { message : string }).message, "error");
        }
    })

    const handleEditLink = useCallback((link : Link) => {
        console.log(link);
        setLinkToEdit(link)
    }, [setLinkToEdit]);

    const handleDeleteLink = useCallback(async(link : Link) => {
        if (isNotTransparencyLinkAnymore(link)) setTransparencyLink(undefined);

        await deleteLinkAsync(link.id_link)
    }, [deleteLinkAsync, setTransparencyLink])

    const isNotTransparencyLinkAnymore = (data : FormSchemaType|Link) => {
        return linkToEdit && linkToEdit.fl_transparencia && !data.fl_transparencia;
    }
    const handleSubmit = useCallback(async (data : FormSchemaType) => {
        if (isNotTransparencyLinkAnymore(data)) setTransparencyLink(undefined);
        await saveLinkAsync({
            ...data,
            id_site : site!.id_site,
            fl_transparencia : data.fl_transparencia,
            id_link : linkToEdit ? linkToEdit.id_link : undefined
        } as unknown as Link);
        setLinkToEdit(undefined);
    }, [ saveLinkAsync, linkToEdit ])

    useEffect(() => {
        if (linkToEdit)
        {
            methods.setValue("nm_link", linkToEdit.nm_link);
            methods.setValue("url_link", linkToEdit.url_link);
            methods.setValue("fl_transparencia", linkToEdit.fl_transparencia);

            return;
        }
        methods.setValue("nm_link", "");
        methods.setValue("url_link", "");
        methods.setValue("fl_transparencia", false);
    }, [linkToEdit, methods.setValue]);

    useEffect(() => {
        if (links)
        {
            const transparencyLink = links.find((link) => link.fl_transparencia)
            transparencyLink && setTransparencyLink(transparencyLink);
        }
    }, [ links, setTransparencyLink, queryClient, handleDeleteLink ]);
    return (
        <CustomDialogContent>
            <main className={"overflow-y-auto w-full p-4 .on-open-modal flex flex-col lg:flex-row gap-5 "}>
                <FormProvider {...methods}>
                    <form
                        className={"flex flex-col gap-3 h-2/3 w-full lg:h-full min-h-[340px] lg:w-1/3 relative "}
                        onSubmit={methods.handleSubmit(handleSubmit)}
                    >
                        <DialogTitle className={"sr-only"}>
                            Criar/visualizar links.
                        </DialogTitle>
                        <h4 className={"text-2xl font-bold py-2 border-b border-zinc-200 mb-4  "}>
                            Criar links
                        </h4>
                        <HookFormInput<keyof FormSchemaType>
                            id={"nm_link"}
                            label={"Nome do link"}
                            name={"nm_link"}
                        />
                        <HookFormInput<keyof FormSchemaType>
                            id={"url_link"}
                            label={"Url"}
                            name={"url_link"}
                        />
                        <Switch<keyof FormSchemaType>
                            label={"Link para transparência?"}
                            name={"fl_transparencia"}
                            render={linkToEdit && linkToEdit.fl_transparencia || !transparencyLink}
                            defaultValue={fl_transparenciaWatched}
                        />

                        <footer className={"flex items-center gap-2 absolute bottom-3 right-0"}>
                            <Button
                                className={`text-zinc-100 font-bold bg-blue-500 hover:bg-blue-600 ${linkToEdit ? "flex" : "hidden"}`}
                                icon={Ban}
                                title={"Cancelar"}
                                description={"Cancelar edição"}
                                onClick={() => {
                                    if (setLinkToEdit)
                                    {
                                        setLinkToEdit(undefined);
                                        methods.setValue("nm_link", "");
                                        methods.setValue("url_link", "");
                                        methods.setValue("fl_transparencia", false);
                                    }
                                }}
                            />
                            <Button
                                icon={Check}
                                type={"submit"}
                                title={"Salvar"}
                            />
                        </footer>
                    </form>
                </FormProvider>
                <div className={"h-[1px] w-full lg:h-full lg:w-[1px] bg-zinc-200 "}/>
                <aside className={"w-full lg:w-2/3 h-1/3  "}>
                    <h2 className={"text-2xl font-bold py-2 border-b border-zinc-200 mb-4 "}>
                        Links criados
                    </h2>
                    <TableContainer
                        sx={{minHeight : 200, position : "relative"}}
                        className='rounded-lg border relative   border-zinc-200   dark:text-zinc-100 shadow-lg'
                    >
                        <Table >
                            <TableHead className={'text-lg font-bold'}>
                                <TableRow  className={"w-full text-lg font-bold"}>
                                    <TableCell align={"left"} className={"text-lg font-bold"}/>
                                    <TableCell align={"left"} className={"text-lg font-bold"}/>

                                    <TableCell align={"left"}  className={"text-lg font-bold"}>
                                        Nome
                                    </TableCell>
                                    <TableCell align={"left"}  className={"text-lg font-bold"}>
                                        Url
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    links && links.length > 0 && (
                                        links.map((link) => (
                                            <LinkRow
                                                key={link.id_link}
                                                link={link}
                                                handleDeleteLink={handleDeleteLink}
                                                handleEditLink={handleEditLink}
                                            />
                                        ))
                                    )
                                }
                                {
                                    links.length == 0 && (
                                        <TableFooter className='text-3xl dark:text-zinc-400 w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap m-auto opacity-60 text-center flex items-center gap-3'>
                                            Nenhum link encontrado
                                        </TableFooter>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                </aside>
            </main>
        </CustomDialogContent>
    );
}
interface LinkRowProps {
    link : Link;
    handleEditLink : (link : Link) => void;
    handleDeleteLink : (link : Link) => void;
}
const LinkRow = ({ link, handleEditLink, handleDeleteLink } : LinkRowProps) => {

    return (
        <TableRow hover>
            <TableCell>
                <Tooltip title={"Editar link"} enterNextDelay={300} enterDelay={300}>
                    <IconButton
                        onClick={() => handleEditLink(link)}
                        color={"info"}
                    >
                        <Pencil size={15}/>
                    </IconButton>
                </Tooltip>

            </TableCell>
            <TableCell>
                <Tooltip title={"Excluir link"} enterNextDelay={300} enterDelay={300}>
                    <IconButton
                        onClick={() => handleDeleteLink(link)}
                        color={"error"}
                    >
                        <Trash size={15}/>
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell>
                {link.nm_link}
            </TableCell>
            <TableCell>
                <LinkNav
                    target={"_blank"}
                    className={"hover:underline hover:text-blue-500"}
                    to={link.url_link.trim()}
                >
                    {link.url_link.trim()}
                </LinkNav>
            </TableCell>
        </TableRow>
    );
}