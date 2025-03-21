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
import {Check, Pencil, Trash} from "lucide-react";
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
interface Props {
    links : Link[];
}
const formSchema = z.object({
    nm_link : z.string().min(3, "É necessário informar como o link será apresentado"),
    url_link : z.string().min(5, "É necessário preencher a url"),
    fl_transparencia : z.boolean()
});

type FormSchemaType = z.infer<typeof formSchema>

export const LinksDialog = ({ links } : Props) => {

    const [ linkToEdit, setLinkToEdit ] = useState<Link|undefined>(undefined);
    const queryClient = useQueryClient();
    const openToast = useContextSelector(toastContext, (c) => c.open);
    const { addLink, deleteLink } = useLinks();
    const site = useSiteContext((state) => state.site);
    const methods = useForm<FormSchemaType>({ resolver : zodResolver(formSchema) });

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
            await queryClient.invalidateQueries({queryKey : ["links"]})
        },
        onError: (err : unknown) => {
            if (err instanceof AxiosError && err.response)
                openToast((err.response.data as { message : string }).message, "error");
        }
    })

    const handleEditLink = useCallback((link : Link) => {
        setLinkToEdit(link)
    }, [setLinkToEdit]);

    const handleDeleteLink = useCallback(async(link : Link) => {
        await deleteLinkAsync(link.id_link)
    }, [])

    const handleSubmit = useCallback(async (data : FormSchemaType) => {
        console.log(data);
        await saveLinkAsync({...data, id_site : site!.id_site} as unknown as Link);
    }, [])

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
    }, [linkToEdit]);
    return (
        <CustomDialogContent>
            <main className={"w-full p-4 .on-open-modal flex flex-col lg:flex-row gap-5 "}>
                <FormProvider {...methods}>
                    <form
                        className={"flex flex-col gap-2 w-full lg:w-1/2 "}
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
                        />
                        <Button
                            icon={Check}
                            className={"self-end "}
                            type={"submit"}
                            title={"Salvar"}
                        />
                    </form>
                </FormProvider>
                <aside className={"w-full lg:w-2/3 h-[82%]"}>
                    <h2 className={"text-2xl font-bold py-2 border-b border-zinc-200 mb-4 "}>
                        Links criados
                    </h2>
                    <TableContainer
                        sx={{minHeight : 200, position : "relative"}}
                        className='rounded-lg border relative h-full  border-zinc-200   dark:text-zinc-100 shadow-lg'
                    >
                        <Table className={"h-full"}>
                            <TableHead className={'text-lg font-bold'}>
                                <TableRow  className={"w-full text-lg font-bold"}>
                                    <TableCell align={"left"} className={"text-lg font-bold"}/>
                                    <TableCell align={"left"} className={"text-lg font-bold"}/>

                                    <TableCell align={"left"} className={"text-lg font-bold"}>
                                        Nome
                                    </TableCell>
                                    <TableCell align={"left"} className={"text-lg font-bold"}>
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
        <TableRow>
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