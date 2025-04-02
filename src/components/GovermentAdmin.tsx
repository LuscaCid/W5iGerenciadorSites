import {FormProvider, useForm} from "react-hook-form";
import z from "zod";
import {HookFormInput} from "../UI/FormInput.tsx";
import {Button} from "../UI/Button.tsx";
import {useMutation} from "@tanstack/react-query";

export const GovernmentAdmin = () => {
    const methods = useForm();

    return (
        <section className={"flex flex-col lg:flex-row gap-2"}>
            {/*formuario do prefeito*/}
            <FormProvider  >
                <form
                    onSubmit={methods.handleSubmit}
                >

                </form>
            </FormProvider>

        </section>
    )
}
const mayorFormSchema = z.object({
    nm_prefeito: z.string().min(3, "O nome precisa ter ao menos 3 caracteres"),
    ds_sobreprefeito : z.string().min(5, "O prefeito precisa ter ao menos uma descrição"),
    ds_enderecoprefeito : z.string().min(5, "O endereço é obrigatório"),
    nu_telefoneprefeito : z.string().min(8, "É necessário informar o telefone"),
    nm_emailprefeito : z.string().email()
});
type MayorFormSchemaType = z.infer<typeof mayorFormSchema>;

const DeputyMayorFormSchema = z.object({
    nm_viceprefeito: z.string().min(3, "O nome precisa ter ao menos 3 caracteres"),
    ds_sobreviceprefeito : z.string().min(5, "O vice-prefeito precisa ter ao menos uma descrição"),
    ds_enderecoviceprefeito : z.string().min(5, "O endereço é obrigatório"),
    nu_telefoneviceprefeito : z.string().min(8, "É necessário informar o telefone"),
    nm_emailviceprefeito : z.string().email()
})
type DeputyMayorFormSchemaType = z.infer<typeof mayorFormSchema>;


function MayorForm() {
    const methods = useForm();
    const {} = useMutation({
        mutationFn :
    })
    return (

        <FormProvider {...methods}>
            <form className={"flex flex-col gap-2"}>

            </form>
        </FormProvider>
    );
}

function DeputyMayorForm() {
    const methods = useForm()
    return (
        <FormProvider {...methods}>
            <form className={"flex flex-col gap-2"}>
                <HookFormInput<keyof T> id={} name={""}/>
                <HookFormInput<keyof T> id={} name={}/>
                <HookFormInput<keyof T> id={} name={}/>
            </form>
        </FormProvider>
    );
}
