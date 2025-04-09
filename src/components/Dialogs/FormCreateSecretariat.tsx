import {CustomDialogContent} from "../CustomDialogContent.tsx";
import {FormProvider, useForm} from "react-hook-form";
import z, {undefined} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useState} from "react";
import {HookFormInput} from "../../UI/FormInput.tsx";
import {useSecretariat} from "../../hooks/useSecretariat.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "../Toast.tsx";
import {Button} from "../../UI/Button.tsx";
import {ArrowRight} from "lucide-react";
import {Secretariat} from "../../@types/Secretariat";
import {DialogTitle} from "@radix-ui/react-dialog";
import {DropImageSlot} from "../DropImageSlot.tsx";
import {useDropzone} from "react-dropzone";

const formSchema = z.object({
    nm_secretariat : z.string().min(3, "Nome muito pequeno para secretaria"),
    nm_secretary : z.string().min(3, "Nome muito pequeno para o secretário"),
    ds_about : z.string(),
    nm_email : z.string(),
    nu_phone : z.string(),
    ds_address : z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;
interface Props {
    secretariatData? : Secretariat
}

export const FormCreateSecretariat = ({ secretariatData } : Props) => {
    const { addSecretariat } = useSecretariat();
    const queryClient = useQueryClient();
    const openToast = useContextSelector(toastContext, s => s.open);
    const methods = useForm<FormSchemaType>({ resolver : zodResolver(formSchema) })

    const [ formImages, setFormImages ] = useState({
        secretariatImage : {} as File,
        organizationalChart : {} as File,
    });

    const [ formPreviewImages, setFormPreviewImages ] = useState({
        secretariatImage : secretariatData && secretariatData.secretariatImage ?  secretariatData.secretariatImage.url : "",
        organizationalChart :  secretariatData && secretariatData.organizationalChart ? secretariatData.organizationalChart.url : "",
    });
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

    const secretariatDropzoneMethods = useDropzone({ onDrop : onDrop as any });
    const chartDropzoneMethods = useDropzone({ onDrop : onDrop as any });

    const { mutateAsync, isPending } = useMutation({
        mutationFn : addSecretariat,
        mutationKey : ["add-secretariat"],
        onSuccess : async () => {
            openToast("Secretaria adicionada");
            await queryClient.invalidateQueries({queryKey : ["get-secretariat"]});
        }
    });

    const handleSubmit = useCallback((data : FormSchemaType) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => formData.append(key, data[key as keyof FormSchemaType]));

        if (formImages.secretariatImage) {

        }
    }, [])
    return (
        <CustomDialogContent className={"w-[90%] h-[80%]  lg:w-[70%]"}>
            <main className={"overflow-y-auto w-full pt-4 pb-1 px-4 .on-open-modal flex  flex-col lg:flex-row gap-5 "}>
                <FormProvider {...methods}>
                    <form
                        className={"flex flex-col gap-3 h-1/2 w-full  lg:h-full min-h-[340px] lg:w-full relative "}
                        onSubmit={methods.handleSubmit(handleSubmit)}
                    >
                        <DialogTitle className={"text-2xl font-bold dark:text-zinc-100"}>
                            Cadastro de secretarias
                        </DialogTitle>
                        <main className={"flex flex-col gap-2 lg:grid grid-cols-2 "}>
                            <HookFormInput<keyof FormSchemaType>
                                id={"nm_secretariat"}
                                name={"nm_secretariat"}
                                placeholder={"Insira o nome da secretaria"}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                id={"nm_secretary"}
                                name={"nm_secretary"}
                                placeholder={"Insira o nome do secretario responsável"}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                id={"nm_email"}
                                name={"nm_email"}
                                placeholder={"Insira o e-mail"}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                id={"nu_phone"}
                                name={"nu_phone"}
                                placeholder={"Insira o Telefone"}
                            />
                            <HookFormInput<keyof FormSchemaType>
                                id={"ds_address"}
                                name={"ds_address"}
                                placeholder={"Descreva o endereço"}
                            />


                        </main>
                        <footer className={"flex w-full"}>
                            <DropImageSlot<keyof typeof formImages>
                                getRootProps={secretariatDropzoneMethods.getRootProps}
                                getInputProps={secretariatDropzoneMethods.getInputProps}
                                handleDeleteImage={handleDeleteImage}
                                isDragActive={secretariatDropzoneMethods.isDragActive}
                                name={"secretariatImage"}
                                imagePreview={formPreviewImages.secretariatImage}
                            />
                            <DropImageSlot<keyof typeof formImages>
                                getRootProps={chartDropzoneMethods.getRootProps}
                                getInputProps={chartDropzoneMethods.getInputProps}
                                handleDeleteImage={handleDeleteImage}
                                isDragActive={chartDropzoneMethods.isDragActive}
                                name={"organizationalChart"}
                                imagePreview={formPreviewImages.organizationalChart}
                            />
                        </footer>
                        <Button
                            type={"submit"}
                            icon={ArrowRight}
                            isLoading={isPending}
                            disabled={isPending}
                            title={"Salvar"}
                        />
                    </form>
                </FormProvider>

            </main>

        </CustomDialogContent>
    );
}