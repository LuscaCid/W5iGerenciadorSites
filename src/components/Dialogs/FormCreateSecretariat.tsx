import {CustomDialogContent} from "../CustomDialogContent.tsx";
import {FormProvider, useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {HookFormInput} from "../../UI/FormInput.tsx";
import {useSecretariat} from "../../hooks/useSecretariat.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "../Toast.tsx";
import {Button} from "../../UI/Button.tsx";
import {Ban, Check, Pencil, Trash} from "lucide-react";
import {Secretariat} from "../../@types/Secretariat";
import {DialogTitle} from "@radix-ui/react-dialog";
import {DropImageSlot} from "../DropImageSlot.tsx";
import {useDropzone} from "react-dropzone";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import {SecretariatDepartment} from "../../@types/SecretariatDepartment";
import {IconButton, TableFooter, Tooltip} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import {useSiteContext} from "../../store/site.ts";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {AlertDialogComponent} from "./AlertDialogComponent.tsx";
import {FormTextarea} from "../../UI/FormTextarea.tsx";

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
    const { addSecretariat, updateSecretariat } = useSecretariat();
    const queryClient = useQueryClient();
    const openToast = useContextSelector(toastContext, s => s.open);
    const methods = useForm<FormSchemaType>({ resolver : zodResolver(formSchema) })

    //informação para atualizar em tempo real e para ser usada para ser enviada para se conectar com secretariat
    const [departmentToEdit, setDepartmentToEdit ] = useState<SecretariatDepartment|undefined>(undefined);
    const site = useSiteContext(state => state.site);

    const [ departments, setDepartments ] = useState(secretariatData ? secretariatData.secretariatDepartments : []);
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


    const { mutateAsync : createSecretariatAsync, isPending } = useMutation({
        mutationFn : addSecretariat,
        mutationKey : ["add-secretariat"],
        onSuccess : async () => {
            openToast("Secretaria adicionada");
            await queryClient.invalidateQueries({queryKey : ["get-secretariat"]});
        }
    });
    const { mutateAsync : updateSecretariatAsync, isPending: isPendingUpdate } = useMutation({
        mutationFn : updateSecretariat,
        mutationKey : ["update-secretariat"],
        onSuccess : async () => {
            openToast("Secretaria atualizada");
            await queryClient.invalidateQueries({queryKey : ["get-secretariat"]});
        }
    });

    const handleSubmit = useCallback( async(data : FormSchemaType) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => formData.append(key, data[key as keyof FormSchemaType]));
        formData.append("id_site", site!.id_site.toString());

        if (secretariatData) formData.append("id_secretariat", secretariatData.id_secretariat!.toString());
        //adiciona as imagens
        if (formImages.secretariatImage) formData.append("secretariatImage", formImages.secretariatImage);
        if (formImages.organizationalChart) formData.append("organizationalChart", formImages.organizationalChart);

        if (departments.length > 0) formData.append("secretariatDepartmentsJSON", JSON.stringify(departments));
        if(secretariatData) return await updateSecretariatAsync(formData)
        return await createSecretariatAsync(formData);

    }, [secretariatData, departments, formImages, site])
    return (
        <CustomDialogContent className={"w-[95%] h-[95%] lg:h-[95%] lg:w-[80%] flex lg:flex-row flex-col"}>
            <main className={"overflow-y-auto w-full p-1 lg:p-4 .on-open-modal flex  flex-col lg:flex-row gap-3 "}>
                <FormProvider {...methods}>
                    <form
                        className={"flex px-2 py-4 flex-col gap-3 h-1/2 w-full relative h-full min-h-[340px] lg:w-3/5 relative overflow-y-auto "}
                        onSubmit={methods.handleSubmit(handleSubmit)}
                    >
                        <DialogTitle className={"text-2xl font-bold p-1 mb-2 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700"}>
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
                        <FormTextarea<keyof FormDepartmentSchemaType>
                            name={"ds_about"}
                            id={"ds_about"}
                            label={"Descrição"}
                            placeholder={"Descrição sobre a secretaria"}
                        />
                        <footer className={"flex lg:flex-row flex-col gap-2 w-full "}>
                            <DropImageSlot<keyof typeof formImages>
                                description={"clique ou arraste aqui a foto do secretário"}
                                getRootProps={secretariatDropzoneMethods.getRootProps}
                                getInputProps={secretariatDropzoneMethods.getInputProps}
                                handleDeleteImage={handleDeleteImage}
                                isDragActive={secretariatDropzoneMethods.isDragActive}
                                name={"secretariatImage"}
                                imagePreview={formPreviewImages.secretariatImage}
                            />
                            <DropImageSlot<keyof typeof formImages>
                                className={"w-full rounded-lg"}
                                description={"Imagem do organograma da secretaria"}
                                getRootProps={chartDropzoneMethods.getRootProps}
                                getInputProps={chartDropzoneMethods.getInputProps}
                                handleDeleteImage={handleDeleteImage}
                                isDragActive={chartDropzoneMethods.isDragActive}
                                name={"organizationalChart"}
                                imagePreview={formPreviewImages.organizationalChart}
                            />
                        </footer>

                        <Button
                            className={"lg:absolute bottom-0 right-0"}
                            type={"submit"}
                            icon={Check}
                            isLoading={isPending || isPendingUpdate}
                            disabled={isPending || isPendingUpdate}
                            title={"Salvar"}
                        />
                    </form>
                </FormProvider>
                <div className={"w-full h-[1px] lg:h-full bg-zinc-200 dark:bg-zinc-700 lg:w-[1px]"}/>
                <FormCreateDepartment
                    departmentToEdit={departmentToEdit}
                    setDepartmentToEdit={setDepartmentToEdit}
                    departments={departments}
                    setDepartments={setDepartments}
                    secretariat={secretariatData}
                />
            </main>

        </CustomDialogContent>
    );
}

const formDepartmentSchema = z.object({
    nm_department : z.string().min(4, "Insira um nome válido para o departamento"),
    ds_about : z.string(),
    nm_email : z.string(),
    nu_phone : z.string(),
    ds_address : z.string(),
    ds_attributions : z.string(),
});

type FormDepartmentSchemaType = z.infer<typeof formDepartmentSchema>

interface FormCreateDepartmentProps {
    departments : SecretariatDepartment[];
    setDepartments : Dispatch<SetStateAction<SecretariatDepartment[]>>;
    secretariat? : Secretariat;
    departmentToEdit : SecretariatDepartment|undefined;
    setDepartmentToEdit :  Dispatch<SetStateAction<SecretariatDepartment | undefined>>;
}

const FormCreateDepartment = (
    {
        setDepartments,
        departments,
        secretariat,
        departmentToEdit,
        setDepartmentToEdit
    } : FormCreateDepartmentProps) =>
{
    const methods = useForm<FormDepartmentSchemaType>({ resolver : zodResolver(formDepartmentSchema)});
    const openToast = useContextSelector(toastContext, s => s.open);
    const site = useSiteContext(state => state.site);

    const handleSubmit = useCallback((data : FormDepartmentSchemaType) => {
        const departmentWithSameNameInSecretariat = departments.find(
            (d) => (d.nm_department == data.nm_department) && !(departmentToEdit && departmentToEdit.nm_department == d.nm_department)
        );
        console.log(departmentWithSameNameInSecretariat);
        if (departmentWithSameNameInSecretariat) return openToast("Departamento com mesmo nome criado", "error");
        methods.reset();
        setDepartmentToEdit(undefined);
        if(departmentToEdit) {
            setDepartments(
                departments.map((d) => {
                    if (d.nm_department == departmentToEdit.nm_department) {
                        return {
                            ...departmentToEdit,
                            ...data as SecretariatDepartment
                        }
                    }
                    return d;
                })
            );
            return;
        }
        const department : SecretariatDepartment = {
            ...data,
            id_site : site!.id_site
        }
        setDepartments([...departments, department])
    }, [departments, site, departmentToEdit])

    const handleSetDepartmentToEdit = useCallback((secretariatDepartment : SecretariatDepartment) => {
        setDepartmentToEdit(secretariatDepartment);
    }, [departmentToEdit])
    const handleDeleteSecretariatDepartment = useCallback(() => {}, []);

    useEffect(() => {
        if (departmentToEdit){
            methods.setValue("nm_department", departmentToEdit.nm_department);
            methods.setValue("ds_about", departmentToEdit.ds_about);
            methods.setValue("nu_phone", departmentToEdit.nu_phone);
            methods.setValue("ds_attributions", departmentToEdit.ds_attributions);
            methods.setValue("ds_address", departmentToEdit.ds_address);
            methods.setValue("nm_email", departmentToEdit.nm_email);
            return;
        }
        methods.reset();
    }, [departmentToEdit]);
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(handleSubmit)}
                className={"flex flex-col  p-1 lg:p-4 gap-2 relative  w-full h-full lg:w-2/5 h-full "}>
                <main className={"flex flex-col lg:grid grid cols-2 gap-2  py-1"}>
                    <h3 className={"text-lg font-bol p-1 mb-2 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700"}>
                        Cadastro do departamentos
                    </h3>
                    <HookFormInput<keyof FormDepartmentSchemaType>
                        id={"nm_department"}
                        name={"nm_department"}
                        placeholder={"Nome do departamento"}
                    />
                    <HookFormInput<keyof FormDepartmentSchemaType>
                        id={"nm_email_department"}
                        name={"nm_email"}
                        type={"email"}
                        placeholder={"E-mail do responsável pelo departamento"}
                    />
                    <HookFormInput<keyof FormDepartmentSchemaType>
                        id={"nu_phone_department"}
                        name={"nu_phone"}
                        placeholder={"Número do departamento"}
                    />
                    <HookFormInput<keyof FormDepartmentSchemaType>
                        id={"ds_attributions"}
                        name={"ds_attributions"}
                        placeholder={"Atribuições"}
                    />
                    <HookFormInput<keyof FormDepartmentSchemaType>
                        id={"ds_address_department"}
                        name={"ds_address"}
                        placeholder={"Endereço"}
                    />
                    <FormTextarea<keyof FormDepartmentSchemaType>
                        name={"ds_about"}
                        id={"ds_about_department"}
                        placeholder={"Discorra sobre o departamento "}
                    />
                </main>
                <TableContainer
                    className='rounded-lg border relative sm:min-h-[250px] lg:min-h-[300px]  2xl:min-h-[350px]  max-h-max  border-zinc-200 dark:border-zinc-700  dark:text-zinc-100  shadow-lg h-full lg:h-[50%] 2xl:h-[70.4%]'
                >
                    <Table >
                        <TableHead className={'text-lg font-bold'}>
                            <TableRow  className={"w-full text-lg font-bold dark:text-zinc-100"}>
                                <TableCell align={"left"} className={"dark:text-zinc-100 text-lg font-bold" }/>
                                <TableCell align={"left"} className={"dark:text-zinc-100 text-lg font-bold"}/>
                                <TableCell className={"dark:text-zinc-100"}>
                                    Nome
                                </TableCell>
                                <TableCell className={"dark:text-zinc-100"}>
                                    Sobre
                                </TableCell>
                                <TableCell className={"dark:text-zinc-100"}>
                                    Telefone
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                departments && departments.length > 0 && (
                                    departments.map((d) => (
                                        <SecretariatDepartmentRow
                                            key={d.id_department}
                                            handleEditSecretariatDepartment={handleSetDepartmentToEdit}
                                            handleDeleteSecretariatDepartment={handleDeleteSecretariatDepartment}
                                            secretariatDepartment={d}
                                        />
                                    ))
                                )
                            }
                            {
                                !departments || (departments && departments.length == 0) &&  (
                                    <TableFooter className='text-2xl dark:text-zinc-400 w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  m-auto opacity-60 text-center flex items-center gap-3'>
                                        Sem itens
                                    </TableFooter>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <footer className={"self-end lg:absolute bottom-0 right-0 flex gap-2 "}>

                    <Button
                        className={`text-zinc-100 font-bold p-2 px-3 bg-blue-500 hover:bg-blue-600 ${departmentToEdit ? "" : "hidden"}`}
                        icon={Ban}
                        title={"Cancelar"}
                        description={"Cancelar edição"}
                        onClick={() => {
                            if (setDepartmentToEdit)
                            {
                                setDepartmentToEdit(undefined);
                                methods.reset()
                            }
                        }}
                    />
                    <Button
                        className={""}
                        type={"submit"}
                        icon={Check}
                        title={"Salvar"}
                    />

                </footer>
            </form>
        </FormProvider>
    )
}

interface SecretariatDepartmentRowProps {
    secretariatDepartment : SecretariatDepartment;
    handleEditSecretariatDepartment : (sd : SecretariatDepartment) => void;
    handleDeleteSecretariatDepartment : (sd : SecretariatDepartment) => void;
}
const SecretariatDepartmentRow = (
    {
        secretariatDepartment,
        handleDeleteSecretariatDepartment,
        handleEditSecretariatDepartment}
    : SecretariatDepartmentRowProps) =>
{

    return (
        <TableRow hover>
            <TableCell>
                <Tooltip title={"Editar banner"} enterNextDelay={300} enterDelay={300}>
                    <IconButton
                        onClick={() => handleEditSecretariatDepartment(secretariatDepartment)}
                        color={"info"}
                    >
                        <Pencil size={15}/>
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell>
                <Tooltip title={"Excluir banner"} enterNextDelay={300} enterDelay={300}>
                    <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                            <IconButton
                                onClick={() => handleDeleteSecretariatDepartment(secretariatDepartment)}
                                color={"error"}
                            >
                                <Trash size={15}/>
                            </IconButton>
                        </AlertDialog.Trigger>
                        <AlertDialogComponent
                            message={"Deseja excluir o departamento?"}
                            action={() => handleDeleteSecretariatDepartment(secretariatDepartment)}
                        />
                    </AlertDialog.Root>
                </Tooltip>
            </TableCell>
            <TableCell className={"dark:text-zinc-100"}>
                {secretariatDepartment.nm_department}
            </TableCell>
            <TableCell className={"dark:text-zinc-100"}>
                {secretariatDepartment.ds_about}
            </TableCell>
            <TableCell className={"dark:text-zinc-100"}>
                {secretariatDepartment.nu_phone}
            </TableCell>
        </TableRow>
    );
}