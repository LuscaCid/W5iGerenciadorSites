import {CustomDialogContent} from "../CustomDialogContent.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {useCallback, useEffect, useState} from "react";
import {Banner} from "../../@types/Banner";
import {HookFormInput} from "../../UI/FormInput.tsx";
import {Button} from "../../UI/Button.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useBanners} from "../../hooks/useBanners.ts";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "../Toast.tsx";
import {useDropzone} from "react-dropzone";
import {Link, Pencil, Trash} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {IconButton, TableFooter, Tooltip} from "@mui/material";
import {Link as LinkNav} from "react-router-dom";
import {useSiteContext} from "../../store/site.ts";
import {PreviewImageDialog} from "./PreviewImageDialog.tsx";
import {CustomOverlay} from "./CustomOverlay.tsx";

export type FormBannerSchemaType = {
    url_link : string;
}

export const BannerDialog = () => {
    const [ bannerToEdit, setBannerToEdit ] = useState<Banner|undefined>();
    const { save, remove, getBanners } = useBanners();
    const openToast = useContextSelector(toastContext, (state) => state.open);
    const queryClient = useQueryClient();
    const methods = useForm<FormBannerSchemaType>();
    const [ file, setFile ] = useState<File|undefined>();
    const [imagePreview, setImagePreview] = useState<string|undefined>();

    const site = useSiteContext(state => state.site);

    const onDrop = useCallback((files : File[]) => {
        const fileDropped = files[0]
        const object = URL.createObjectURL(fileDropped);
        setImagePreview(object);

        setFile(fileDropped);
    }, [file, setFile, imagePreview]);

    const { data : banners } = useQuery({
        queryFn : async ()=> await getBanners(),
        queryKey : ["banners"]
    });
    const { isDragActive, getRootProps, getInputProps } = useDropzone({onDrop});

    const { mutateAsync : saveBannerAsync, isPending } = useMutation({
        mutationFn : save,
        mutationKey : ["save-banner"],
        onSuccess : async () => {
            openToast("Banner criado com sucesso", "success");
            methods.reset();
            setImagePreview(undefined);
            setFile(undefined);
            await queryClient.invalidateQueries({queryKey : ["banners"]})
        },
        onError: (err : unknown) => {
            if (err instanceof AxiosError && err.response)
                openToast((err.response.data as { message : string }).message, "error");
        }
    });
    const { mutateAsync : deleteBannerAsync } = useMutation({
        mutationFn : remove,
        mutationKey : ["delete-banner"],
        onSuccess : (_, variables) => {
            openToast("Banner excluído", "success");
            queryClient.setQueryData(["banners"], (prev : Banner[]) => prev.filter((b) => b.id_banner != variables) )
        },
        onError : (err: unknown) => {
            if (err instanceof AxiosError && err.response)
                openToast(err.response.data.message, "error");
        }
    });
    const handleDeleteBanner = useCallback((banner : Banner) => {
        deleteBannerAsync(banner.id_banner);
    }, [deleteBannerAsync]);

    const handleEditBanner = useCallback((banner : Banner) => {
        setBannerToEdit(banner);
    }, [bannerToEdit]);

    const handleSubmit = useCallback(async (payload : FormBannerSchemaType) => {
        const formData = new FormData();
        if (!file)  return openToast("É necessário enviar a imagem do banner", "error");

        formData.append("image", file);
        formData.append("url_link", payload.url_link);
        formData.append("id_site", site!.id_site!.toString())
        bannerToEdit && formData.append("id_banner", bannerToEdit.id_banner.toString())
        await saveBannerAsync(formData)

    }, [file, site, bannerToEdit, methods.setValue]);

    useEffect(() => {
        if (bannerToEdit) return methods.setValue("url_link", bannerToEdit.url_link);

        methods.reset();
    }, [bannerToEdit, methods]);
    return (
        <CustomDialogContent className={"w-[95%] h-[95%]  lg:w-[70%]"}>
            <main className={"overflow-y-auto w-full pt-4 pb-1 px-4 .on-open-modal flex  flex-col lg:flex-row gap-5 "}>
                <FormProvider {...methods}>
                    <form
                        className={"flex flex-col gap-3 h-1/2 w-full lg:h-full min-h-[340px] lg:w-1/3 relative "}
                        onSubmit={methods.handleSubmit(handleSubmit)}
                    >
                        <Dialog.Title
                            className={"sr-only"}
                        >
                            Criar/visualizar Banners.
                        </Dialog.Title>
                        <h4 className={"text-2xl font-bold py-2 border-b border-zinc-200 dark:text-zinc-100 dark:border-b-zinc-700 mb-4  "}>
                            Cadastrar Banners
                        </h4>
                        <HookFormInput<keyof FormBannerSchemaType>
                            id={"url_link"}
                            name={"url_link"}
                            placeholder={"URL"}
                            icon={Link}
                        />
                        <div
                            className={`rounded-lg border-[4px] h-[200px] flex items-center justify-center font-bold text-lg text-zinc-800 dark:text-zinc-500 border-dashed overflow-hidden border-zinc-200 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-700 transition duration-150 ${isDragActive ? "animate-pulse" : ""}`}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            {
                                imagePreview ? (
                                        <img src={imagePreview} alt=""  className={"object-cover max-w-max max-h-max w-full"} />
                                    ) : (
                                    isDragActive ?
                                        <p>Solte o arquivo aqui</p> :
                                        <p>Segure e solte a imagem aqui</p>
                                )
                            }
                        </div>
                        <Button
                            disabled={isPending}
                            isLoading={isPending}
                            pendingMessage={"Carregando"}
                            className={"w-fit self-end"}
                            title={bannerToEdit ? "Editar" : "Salvar"}
                            type={"submit"}
                        />
                    </form>
                </FormProvider>
                <div className={"h-[1px] w-full lg:h-full lg:w-[1px] bg-zinc-200 dark:bg-zinc-700 "}/>

                <aside className={"w-full lg:w-2/3 h-1/2 lg:h-full pb-4 "}>
                    <h2 className={"text-2xl font-bold py-2 border-b border-zinc-200 mb-4 dark:text-zinc-100 dark:border-b-zinc-700 "}>
                        Banners criados
                    </h2>
                    <TableContainer
                        sx={{minHeight : 200, position : "relative"}}
                        className='rounded-lg border relative   border-zinc-200 dark:border-zinc-700  dark:text-zinc-100  shadow-lg h-full lg:h-[90%] 2xl:h-[92.4%]'
                    >
                        <Table >
                            <TableHead className={'text-lg font-bold'}>
                                <TableRow  className={"w-full text-lg font-bold"}>
                                    <TableCell align={"left"} className={"dark:text-zinc-100 text-lg font-bold"}/>
                                    <TableCell align={"left"} className={"dark:text-zinc-100 text-lg font-bold"}/>
                                    <TableCell align={"left"} className={"dark:text-zinc-100 text-lg font-bold"}>
                                    <span
                                        className={"dark:text-zinc-100"}
                                    >
                                        Imagem em preview
                                    </span>
                                    </TableCell>
                                    <TableCell align={"left"}  className={"dark:text-zinc-100 text-lg font-bold"}>
                                        <span
                                            className={"dark:text-zinc-100"}
                                        >
                                            Url
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    banners && banners.length > 0 && (
                                        banners.map((banner) => (
                                            <BannerRow
                                                key={banner.id_banner}
                                                banner={banner}
                                                handleDeleteBanner={handleDeleteBanner}
                                                handleEditBanner={handleEditBanner}
                                            />
                                        ))
                                    )
                                }
                                {
                                    !banners || (banners && banners.length == 0) &&  (
                                        <TableFooter className='text-3xl dark:text-zinc-400 w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap m-auto opacity-60 text-center flex items-center gap-3'>
                                            Nenhum banner encontrado.
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
interface BannerRowProps {
    banner : Banner;
    handleEditBanner : (banner : Banner) => void;
    handleDeleteBanner : (banner : Banner) => void;
}
const BannerRow = ({ banner, handleEditBanner, handleDeleteBanner } : BannerRowProps) => {

    return (
        <TableRow hover>
            <TableCell>
                <Tooltip title={"Editar banner"} enterNextDelay={300} enterDelay={300}>
                    <IconButton
                        onClick={() => handleEditBanner(banner)}
                        color={"info"}
                    >
                        <Pencil size={15}/>
                    </IconButton>
                </Tooltip>

            </TableCell>
            <TableCell>
                <Tooltip title={"Excluir banner"} enterNextDelay={300} enterDelay={300}>
                    <IconButton
                        onClick={() => handleDeleteBanner(banner)}
                        color={"error"}
                    >
                        <Trash size={15}/>
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell className={"overflow-hidden"}>
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Tooltip title={"Visualizar imagem"}>
                            <img
                                src={banner.url_thumbnail}
                                className={"w-40 h-full object-cover hover:scale-105 cursor-pointer transition duration-150"}
                                alt={"imagem do banner"}
                            />
                        </Tooltip>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <CustomOverlay/>
                        <PreviewImageDialog src={banner.url_thumbnail!} alt={"Imagem do banner"} />
                    </Dialog.Portal>
                </Dialog.Root>
            </TableCell>
            <TableCell>
                <LinkNav
                    target={"_blank"}
                    className={"hover:underline hover:text-blue-500 dark:text-zinc-100"}
                    to={banner.url_link}
                >
                    {banner.url_link.trim()}
                </LinkNav>
            </TableCell>
        </TableRow>
    );
}