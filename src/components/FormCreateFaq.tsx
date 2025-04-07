import {FormProvider, useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {HookFormInput} from "../UI/FormInput.tsx";
import {Dispatch, SetStateAction, useCallback, useEffect} from "react";
import {useUserContext} from "../store/user.ts";
import {SliderComponent} from "../UI/Slider.tsx";
import {Faq} from "../@types/Faq";
import {Button} from "../UI/Button.tsx";
import {useMutation} from "@tanstack/react-query";
import {useFaqs} from "../hooks/useFaqs.ts";
import {Title} from "./Title.tsx";
import {useSiteContext} from "../store/site.ts";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "./Toast.tsx";
import {AxiosError} from "axios";
import {Ban} from "lucide-react";
enum Level {
    Baixo = "1",
    Medio = "2",
    Alto = "3"
}
const faqFormSchema = z.object({
    ds_questao : z.string().min(4, "A pergunta é obrigatória"),
    ds_resposta : z.string().min(4, "É necessário informar uma resposta para a pergunta"),
    nu_nivel : z.nativeEnum(Level)
});
type FaqFormSchemaType = z.infer<typeof faqFormSchema>;

interface Props {
    faqToEdit? : Faq;
    setFaqToEdit : Dispatch<SetStateAction<Faq|undefined>>
}
export const FormCreateFaq = ({ faqToEdit, setFaqToEdit } : Props) => {
    const { addFaq } = useFaqs();
    const site = useSiteContext(state => state.site);
    const openToast = useContextSelector(toastContext, (s) => s.open);
    const methods = useForm<FaqFormSchemaType>({ resolver : zodResolver(faqFormSchema) });
    const levelWatched = methods.watch("nu_nivel");

    const {mutateAsync : saveFaqAsync, isPending } = useMutation({
        mutationFn : addFaq,
        mutationKey : ["add-faq"],
        onSuccess : () => {
            openToast("FAQ salva com sucesso", "success")
        },
        onError : (err : unknown) => {
            if (err instanceof AxiosError && err.response)
                openToast((err.response.data as { message : string }).message, "error");
        }
    })
    const user = useUserContext(state => state.user);

    const handleSubmitForm = useCallback(async(data : FaqFormSchemaType) => {
        console.log(data);

        const dataToSend = {
            ...data,
            id_usuario : user!.id_usuario,
            id_site : site!.id_site,
        } as unknown as Faq;
        await saveFaqAsync(dataToSend);
    }, [site, user]);

    useEffect(() => {
        if (faqToEdit)
        {
            methods.setValue("ds_resposta", faqToEdit.ds_resposta);
            methods.setValue("ds_questao", faqToEdit.ds_questao);
            methods.setValue("nu_nivel", faqToEdit.nu_nivel as unknown as Level);
            return;
        }
        methods.reset();
    }, [faqToEdit]);
    return (
        <FormProvider {...methods}>
            <form
                id={"form_faq"}
                name={"form_faq"}
                onSubmit={methods.handleSubmit(handleSubmitForm)}
                className={"flex flex-col gap-5 lg:w-1/3 h-full "}
            >
                <Title title={"Cadastrar FAQ"} id={"faq"}/>
                <HookFormInput<keyof FaqFormSchemaType>
                    name={"ds_questao"}
                    id={"ds_questao"}
                    label={"Pergunta"}
                    placeholder={"Insira aqui enunciado da pergunta"}
                />
                <textarea
                    className={"p-1 focus:outline-none border-none bg-transparent w-full  max-h-[400px] min-h-[40px]  focus:ring-[3px] transition duration-150 focus:ring-blue-300"}
                    {...methods.register("ds_resposta")}
                    placeholder={"Insira aqui a resposta "}
                >
                </textarea>
                <fieldset className={"flex flex-col  gap-2"}>
                    <label
                        htmlFor={"nu_nivel"}
                    >
                        Informe o nível do quão frequente é a pergunta
                    </label>
                    <aside className={"flex gap-2 items-center"}>
                        <SliderComponent<keyof FaqFormSchemaType>
                            name={"nu_nivel"}
                            id={"nu_nivel"}
                            step={1}
                            max={2}
                        />
                        <span className={"rounded-full h-10 w-10 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800"}>
                            {levelWatched}
                        </span>
                    </aside>

                </fieldset>
                <footer className={"flex gap-2 items-center self-end"}>
                    <Button
                        className={`text-zinc-100 font-bold  bg-blue-500 hover:bg-blue-600 ${faqToEdit ? "" : "hidden"}`}
                        icon={Ban}
                        title={"Cancelar"}
                        description={"Cancelar edição"}
                        onClick={() => {
                            if (faqToEdit)
                            {
                                setFaqToEdit(undefined);
                                methods.setValue("ds_questao", "");
                                methods.setValue("ds_resposta", "");
                                methods.setValue("nu_nivel", Level.Baixo);
                            }
                        }}
                    />
                    <Button
                        form={"form_faq"}
                        isLoading={isPending}
                        type={"submit"}
                        className={"w-fit "}
                        title={faqToEdit ? "Editar" : "Salvar"}
                    />
                </footer>

            </form>
        </FormProvider>
    );
}