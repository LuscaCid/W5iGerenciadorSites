import {FormProvider, useForm} from "react-hook-form";
import z, {undefined} from "zod";
import {HookFormInput} from "../UI/FormInput.tsx";
import {Button} from "../UI/Button.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useEffect, useState} from "react";
import {useGovernment} from "../hooks/useGovernment.ts";
import {AxiosError} from "axios";
import {getAxiosErrorMessage} from "../utils/treatAxiosError.ts";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "./Toast.tsx";
import {Government} from "../@types/Government";
import {Title} from "./Title.tsx";
import {Check, Mail, MapPinHouse, Phone, Trash} from "lucide-react";
import {useSiteContext} from "../store/site.ts";
import {HookFormTextarea} from "../UI/HookFormTextarea.tsx";
import {DropzoneInputProps, DropzoneRootProps, useDropzone} from "react-dropzone";
import {twMerge} from "tailwind-merge";

const GovernmentFormSchema = z.object({
    nm_viceprefeito: z.string().min(3, "O nome precisa ter ao menos 3 caracteres"),
    ds_sobreviceprefeito : z.string().min(5, "O vice-prefeito precisa ter ao menos uma descrição"),
    ds_enderecoviceprefeito : z.string().min(5, "O endereço é obrigatório"),
    nu_telefoneviceprefeito : z.string().min(8, "É necessário informar o telefone"),
    nm_emailviceprefeito : z.string().email(),
    nm_prefeito: z.string().min(3, "O nome precisa ter ao menos 3 caracteres"),
    ds_sobreprefeito : z.string().min(5, "O prefeito precisa ter ao menos uma descrição"),
    ds_enderecoprefeito : z.string().min(5, "O endereço é obrigatório"),
    nu_telefoneprefeito : z.string().min(8, "É necessário informar o telefone"),
    nm_emailprefeito : z.string().email()
})
type FormSchemaType = z.infer<typeof GovernmentFormSchema>;

interface Props {
    governmentData? : Government
}
export const GovernmentAdmin = ({ governmentData : govData } : Props) =>
{
    const site = useSiteContext(state => state.site);
    const openToast = useContextSelector(toastContext, (s) => s.open);
    const queryClient = useQueryClient();
    const [ governmentData, setGovernmentData ] = useState(govData);
    const methods = useForm<FormSchemaType>({
        resolver : zodResolver(GovernmentFormSchema),
        defaultValues : {
            nm_emailviceprefeito : governmentData ? governmentData.nm_emailviceprefeito : "",
            nm_emailprefeito : governmentData ? governmentData.nm_emailprefeito : "",
            nm_prefeito : governmentData ? governmentData.nm_prefeito : "",
            nm_viceprefeito : governmentData ? governmentData.nm_viceprefeito : "",
            nu_telefoneviceprefeito : governmentData ? governmentData.nu_telefoneviceprefeito : "",
            nu_telefoneprefeito : governmentData ? governmentData.nu_telefoneprefeito : "",
            ds_enderecoviceprefeito : governmentData ? governmentData.ds_enderecoviceprefeito : "",
            ds_enderecoprefeito : governmentData ? governmentData.ds_enderecoprefeito : "",
            ds_sobreviceprefeito : governmentData ? governmentData.ds_sobreviceprefeito : "",
            ds_sobreprefeito : governmentData ? governmentData.ds_sobreprefeito : "",
        }
    });
    const [ formImages, setFormImages ] = useState({
        deputyMayorImage : {} as File,
        mayorImage : {} as File,
        organizationalChart : {} as File
    });

    const [ formPreviewImages, setFormPreviewImages ] = useState({
        deputyMayorImage : governmentData && governmentData.deputyMayorImage ?  governmentData.deputyMayorImage.url : "",
        mayorImage :  governmentData && governmentData.mayorImage ? governmentData.mayorImage.url : "",
        organizationalChart : governmentData && governmentData.organizationalChart ? governmentData.organizationalChart.url : "",
    });
    const {
        createSiteGovernment,
        updateSiteGovernment,
        getSiteGovernmentData
    } = useGovernment();

    const { mutateAsync : createGovernmentAsync, isPending } = useMutation({
        mutationFn : createSiteGovernment,
        mutationKey : ['createSiteGovernment'],
        onSuccess : (data) => {
            openToast("Dados estruturais cadastrados");
            queryClient.setQueryData(["government"], () => data);
        },
        onError : err => {
            if (err instanceof AxiosError)
                openToast(getAxiosErrorMessage(err), "error");
        }
    })
    const handleDeleteImage = useCallback((id : string) => {
        setFormImages({ ...formImages, [id as keyof typeof formImages ] : undefined });
        setFormPreviewImages({...formPreviewImages, [id as keyof typeof formImages] : ""});
    }, [formImages, formPreviewImages]);
    const setFormImageByKeyFile = useCallback((file : File, key : keyof typeof formImages) => {
        const object = URL.createObjectURL(file);

        setFormImages({ ...formImages, [key] : file });
        setFormPreviewImages({ ...formPreviewImages, [key] : object })
    }, [ formImages, formPreviewImages ]);

    const onDrop = useCallback((files : File[], _ : any, event : { target : { id : string } }) => {
        const file = files[0] ?? null;

        if (file) setFormImageByKeyFile(file, event.target.id as keyof typeof formImages);
    }, [ formImages, formPreviewImages, setFormImageByKeyFile ]);

    const dropzoneProps = useDropzone({ onDrop : onDrop as any });

    const { mutateAsync : updateSiteGovernmentAsync } = useMutation({
        mutationFn : updateSiteGovernment,
        mutationKey : ['updateSiteGovernment'],
        onSuccess : () => {
            openToast("Dados estruturais atualizados")
        },
        onError : err => {
            if (err instanceof AxiosError)
                openToast(getAxiosErrorMessage(err), "error");
        }
    });
    const handleSubmit = useCallback(async(data : FormSchemaType) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key as keyof typeof data]) formData.append(key, data[key as keyof typeof data]);
        })

        formData.append("id_site", site!.id_site.toString())

        if (formImages.deputyMayorImage) formData.append("deputyMayor", formImages.deputyMayorImage);
        if (formImages.organizationalChart) formData.append("organizationalChart", formImages.organizationalChart);
        if (formImages.mayorImage) formData.append("mayor", formImages.mayorImage);

        if (governmentData) await updateSiteGovernmentAsync(formData);
        else await createGovernmentAsync(formData);
    }, [site, formImages]);

    useEffect(() => {
        if (!governmentData && site) {
            getSiteGovernmentData()
            .then(data => {
                if (data) {
                    setGovernmentData(data)
                    methods.setValue("nm_emailviceprefeito", data.nm_emailviceprefeito);
                    methods.setValue("nm_emailprefeito", data.nm_emailprefeito);
                    methods.setValue("nm_prefeito", data.nm_prefeito);
                    methods.setValue("nm_viceprefeito", data.nm_viceprefeito);
                    methods.setValue("nu_telefoneviceprefeito", data.nu_telefoneviceprefeito);
                    methods.setValue("nu_telefoneprefeito", data.nu_telefoneprefeito);
                    methods.setValue("ds_enderecoviceprefeito", data.ds_enderecoviceprefeito);
                    methods.setValue("ds_enderecoprefeito", data.ds_enderecoprefeito);
                    methods.setValue("ds_sobreviceprefeito", data.ds_sobreviceprefeito);
                    methods.setValue("ds_sobreprefeito", data.ds_sobreprefeito);
                    setFormPreviewImages({
                        organizationalChart: data.organizationalChart.url ??"",
                        mayorImage:  data.mayorImage.url ?? "",
                        deputyMayorImage:  data.deputyMayorImage.url ?? "",
                    });
                }
            });
        }
    }, [governmentData, site, govData,methods, formImages, formPreviewImages]);
    return (
        <section className={"flex flex-col lg:flex-row gap-5 mb-10"}>
            <FormProvider {...methods} >
                <form
                    className={"w-full flex flex-col gap-10"}
                    onSubmit={methods.handleSubmit(handleSubmit)}
                >
                    <Title
                        title={"Cadastro da estrutura organizacional"}
                        id={"Governo"}
                    />
                    <main className={"flex flex-col lg:flex-row w-full gap-2 p-1"}>
                        <article className={"flex flex-col gap-4 w-full lg:w-1/2"}>
                            <h2 className={"text-2xl font-semibold pb-2 border-b border-zinc-200 dark:border-zinc-800"}>
                                Dados do prefeito
                            </h2>
                            <section className={"flex flex-col lg:flex-row gap-5 "}>
                                <GovernmentImageSlot<keyof typeof formImages>
                                    isDragActive={dropzoneProps.isDragActive}
                                    getInputProps={dropzoneProps.getInputProps}
                                    getRootProps={dropzoneProps.getRootProps}
                                    name={"mayorImage"}
                                    handleDeleteImage={handleDeleteImage}
                                    imagePreview={formPreviewImages.mayorImage}
                                    description={"clique ou arraste a foto do prefeito aqui"}
                                />

                                <aside className={"flex flex-col gap-3 w-full"}>
                                    <HookFormTextarea<keyof FormSchemaType>
                                        name={"nm_prefeito"}
                                        variant={"subtitle"}
                                        placeholder={"Nome do prefeito"}
                                    />
                                    <HookFormTextarea<keyof FormSchemaType>
                                        name={'ds_sobreprefeito'}
                                        placeholder={"Descrição do prefeito"}
                                        variant={"paragraph"}
                                    />
                                </aside>
                            </section>
                            <HookFormInput<keyof FormSchemaType>
                                name={"nm_emailprefeito"}
                                placeholder={"E-mail para contato"}
                                id={"nm_emailprefeito"}
                                icon={Mail}
                                type={"email"}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                name={"nu_telefoneprefeito"}
                                placeholder={"Telefone para contato"}
                                id={"nu_telefoneprefeito"}
                                icon={Phone}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                name={"ds_enderecoprefeito"}
                                placeholder={"Endereço"}
                                id={"ds_enderecoprefeito"}
                                icon={MapPinHouse}
                            />
                        </article>
                        <div className={"bg-zinc-200 dark:bg-zinc-800 h-[1px] w-full lg:w-[1px] lg:h-full"}/>
                        <article className={"flex flex-col gap-4 w-full lg:w-1/2"}>
                            <h2 className={"text-2xl font-semibold pb-2 border-b border-zinc-200 dark:border-zinc-800"}>
                                Dados do vice-prefeito
                            </h2>
                            <section className={"flex flex-col lg:flex-row gap-5 w-full"}>
                                <GovernmentImageSlot<keyof typeof formImages>
                                    isDragActive={dropzoneProps.isDragActive}
                                    getInputProps={dropzoneProps.getInputProps}
                                    getRootProps={dropzoneProps.getRootProps}
                                    name={"deputyMayorImage"}
                                    imagePreview={formPreviewImages.deputyMayorImage}
                                    handleDeleteImage={handleDeleteImage}
                                    description={"clique ou arraste a foto do vice-prefeito aqui"}
                                />

                                <aside className={"flex flex-col gap-3 w-full"}>
                                    <HookFormTextarea<keyof FormSchemaType>
                                        name={"nm_viceprefeito"}
                                        variant={"subtitle"}
                                        placeholder={"Nome do vice-prefeito"}
                                        className={"w-full"}
                                    />
                                    <HookFormTextarea<keyof FormSchemaType>
                                        name={'ds_sobreviceprefeito'}
                                        placeholder={"Descrição do vice-prefeito"}
                                        variant={"paragraph"}
                                    />
                                </aside>
                            </section>
                            <HookFormInput<keyof FormSchemaType>
                                name={"nm_emailviceprefeito"}
                                placeholder={"E-mail para contato"}
                                id={"nm_emailprefeito"}
                                icon={Mail}
                                type={"email"}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                name={"nu_telefoneviceprefeito"}
                                placeholder={"Telefone para contato"}
                                id={"nu_telefoneprefeito"}
                                icon={Phone}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                name={"ds_enderecoviceprefeito"}
                                placeholder={"Endereço"}
                                id={"ds_enderecoviceprefeito"}
                                icon={MapPinHouse}
                            />
                        </article>

                    </main>
                    <GovernmentImageSlot<keyof typeof formImages>
                        isDragActive={dropzoneProps.isDragActive}
                        getInputProps={dropzoneProps.getInputProps}
                        getRootProps={dropzoneProps.getRootProps}
                        name={"organizationalChart"}
                        imagePreview={formPreviewImages.organizationalChart}
                        handleDeleteImage={handleDeleteImage}
                        className={"m-auto rounded-lg w-full lg:w-[800px] lg:h-[500px]"}
                        description={"clique ou arraste a imagem do organograma aqui"}
                    />
                    <footer className={"self-end flex items-center gap-2"}>

                        <Button
                            disabled={isPending}
                            isLoading={isPending}
                            type={"submit"}
                            className={"w-fit"}
                            title={"Salvar"}
                            icon={Check}
                        />
                    </footer>
                </form>
            </FormProvider>
        </section>
    )
}

interface DropzoneSlotProps <U extends string> {
    getRootProps : <T extends DropzoneRootProps>(props?: T) => T
    getInputProps : <T extends DropzoneInputProps>(props?: T) => T;
    imagePreview? : string;
    handleDeleteImage : (id : string) => void;
    isDragActive : boolean;
    className? : string;
    description? : string;
    name : U;
}
function GovernmentImageSlot <U extends string>(
    {
        name,
        imagePreview,
        getRootProps,
        getInputProps,
        className,
        isDragActive,
        handleDeleteImage,
        description
    } : DropzoneSlotProps<U>
)
{
    const patternStyle = `rounded-full ${!imagePreview ? "border-dashed border-[4px]" : ""} w-full flex h-[250px] w-[250px] items-center justify-center font-bold  text-lg text-zinc-800 dark:text-zinc-500  overflow-hidden border-zinc-200 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-700 transition duration-150 ${isDragActive ? "animate-pulse" : ""}`;

    return (
        <article className={"relative w-fit"}>
            <button
                type={"button"}
                id={name}
                className={twMerge([patternStyle], [className])}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {
                    imagePreview ? (
                        <img src={imagePreview} alt={""} className={"w-full"} />
                    ) : (
                        isDragActive ?
                            <p className={"m-10"} id={name}>Solte o arquivo aqui</p> :
                            <p className={"m-10"} id={name}>{description ? description : "clique ou arraste aqui o arquivo"}</p>
                    )
                }
            </button>
                <Button
                    icon={Trash}
                    className={`${imagePreview ? "opacity-100" : "opacity-0"} transition-all duration-150 bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 absolute bottom-3 right-3 rounded-full p-1 h-10 w-10 flex items-center justify-center z-30`}
                    onClick={() => handleDeleteImage(name)}
                />
        </article>

    )

}
