import z from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {useCallback, useEffect, useRef} from "react";
import {useTags} from "../hooks/useTags.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useToastContext} from "../store/toast.ts";
import {HookFormInput} from "../UI/FormInput.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import {Send, Tag} from "lucide-react";
import {Button} from "../UI/Button.tsx";
const formSchema = z.object({
    nm_slug : z.string().min(3),
})
type FormSearchType = z.infer<typeof formSchema>;
export const FormCreateTag = () => {
    const { open : openToast } = useToastContext();
    const queryClient = useQueryClient();

    const methods = useForm<FormSearchType>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            nm_slug : "",
        }
    });
    const formRef = useRef<HTMLFormElement|null>(null);
    const { addTag } = useTags();

    const { mutateAsync : addTagAsync, isPending } = useMutation({
        mutationFn : addTag,
        mutationKey : ["addTag"],
        onSuccess : async () => {
            await queryClient.invalidateQueries({queryKey : ["tags"]});
            openToast("Tag salva", "success");
        }
    });
    const handleSubmit = useCallback(async (data: FormSearchType) =>
    {
        await addTagAsync(data);
    }, [ addTagAsync ])
    useEffect(() => {
        function enterEvent (e : KeyboardEvent) {
            if (e.key == "Enter" && formRef.current)
            {
                formRef.current.submit();
            }
        }
        document.addEventListener("keypress", enterEvent);

        return () => document.removeEventListener("keypress", enterEvent);
    }, [formRef]);

    return (
        <FormProvider { ...methods }>
            <form
                ref={formRef}
                onSubmit={methods.handleSubmit(handleSubmit)}
                className={"w-full p-4 relative h-full"}
            >
                <h4 className={"text-2xl font-bold py-2 border-b border-zinc-200  "}>
                    Cadastrar tag
                </h4>
                <HookFormInput<keyof FormSearchType>
                    name={"nm_slug"}
                    placeholder={"Nome da tag"}
                    id={"nm_slug"}
                    icon={Tag}
                />
                <Button
                    className={"p-2 px-3 rounded-lg hover:bg-green-600 bg-green-500 flex items-center flex-row-reverse self-end absolute bottom-2 right-2"}
                    type={'submit'}
                    isLoading={isPending}
                    disabled={isPending}
                    icon={Send}
                    title={"Cadastrar"}
                />
            </form>
        </FormProvider>

    );
}