import {FormProvider, useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {HookFormInput} from "../UI/FormInput.tsx";
import {useCallback} from "react";
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
enum Level {
    Baixo = 1,
    Medio = 2,
    Alto = 3
}
const faqFormSchema = z.object({
    ds_questao : z.string().min(4, "A pergunta é obrigatória"),
    ds_resposta : z.string().min(4, "É necessário informar uma resposta para a pergunta"),
    nu_nivel : z.nativeEnum(Level)
});
type FaqFormSchemaType = z.infer<typeof faqFormSchema>;

interface Props {
    faqToEdit? : Faq;
}
export const FormCreateFaq = ({ faqToEdit } : Props) => {
    const { addFaq } = useFaqs();
    const site = useSiteContext(state => state.site);
    const openToast = useContextSelector(toastContext, (s) => s.open);
    const methods = useForm<FaqFormSchemaType>({
        resolver : zodResolver(faqFormSchema),
        defaultValues : {
            ds_questao : faqToEdit ? faqToEdit.ds_questao : "",
            ds_resposta : faqToEdit ? faqToEdit.ds_resposta : "",
            nu_nivel : faqToEdit ? faqToEdit.nu_nivel! : Level.Baixo,
        }

    });
    const levelWatched = methods.watch("nu_nivel");

    const {mutateAsync : saveFaqAsync, isPending } = useMutation({
        mutationFn : addFaq,
        mutationKey : ["add-faq"],
        onSuccess : () => {
            openToast("FAQ salva com sucesso", "success")
        },
        onError : (err : unknown) => {
            if (err instanceof AxiosError && err.response && err.response.data.message)
                openToast(err.message, "error");
        }
    })
    const user = useUserContext(state => state.user);

    const handleSubmitForm = useCallback(async(data : FaqFormSchemaType) => {
        const dataToSend = {
            ...data,
            id_usuario : user!.id_usuario,
            id_site : site!.id_site,
        } as unknown as Faq;
        await saveFaqAsync(dataToSend);
    }, [site])
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(handleSubmitForm)}
                className={"flex flex-col gap-5 lg:w-1/3 h-full "}>
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
                <label
                    htmlFor={"nu_nivel"}
                >
                    Nível
                </label>

                <footer className={"flex gap-2 items-center "}>
                    <SliderComponent<keyof FaqFormSchemaType>
                        name={"nu_nivel"}
                        id={"nu_nivel"}
                        step={1}
                        max={2}
                    />
                    <span className={"rounded-lg p-2 bg-zinc-200 dark:bg-zinc-800"}>
                        {levelWatched}
                    </span>
                </footer>
                <Button
                    disabled={isPending}
                    isLoading={isPending}
                    type={"submit"}
                    className={"w-fit self-end"}
                    title={faqToEdit ? "Editar" : "Salvar"}
                />
            </form>
        </FormProvider>
    );
}