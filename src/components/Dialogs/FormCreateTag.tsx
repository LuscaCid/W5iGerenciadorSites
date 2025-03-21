import z from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef} from "react";
import {useTags} from "../../hooks/useTags.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {HookFormInput} from "../../UI/FormInput.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import {Send, Tag, Ban} from "lucide-react";
import {Button} from "../../UI/Button.tsx";
import {useSiteContext} from "../../store/site.ts";
import { Tag as TagType } from "../../@types/Tag"
import {toastContext} from "../Toast.tsx";
import {useContextSelector} from "use-context-selector";
import {updateTagsStateActions} from "../../@shared/updateTagsStateActions.ts";

interface Props {
    tag? : TagType;
    setTagToEdit? : Dispatch<SetStateAction<TagType|undefined>>
}
const formSchema = z.object({
    nm_slug : z.string().min(2, "Tag muito curta").max(30, "Tag muito grande"),
})
type FormSearchType = z.infer<typeof formSchema>;
export const FormCreateTag = ({ tag, setTagToEdit } : Props) => {
    const openToast = useContextSelector(toastContext, (context) => context.open);
    const queryClient = useQueryClient();
    const site = useSiteContext(state => state.site);
    const formRef = useRef<HTMLFormElement|null>(null);
    const { addTag } = useTags();
    const { updateTagsState, updateTagsInNewsState } = updateTagsStateActions({ queryClient });


    const methods = useForm<FormSearchType>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            nm_slug : tag ? tag.nm_slug : "",
        }
    });

    const { mutateAsync : addTagAsync, isPending } = useMutation({
        mutationFn : addTag,
        mutationKey : ["addTag"],
        onSuccess : async (data, variables) => {
            if (tag)
            {
                updateTagsState(tag, variables);
                updateTagsInNewsState(tag, variables);

                openToast("Tag salva", "success");
                return;
            }
            queryClient.setQueryData(["tags"], (prev : TagType[]) => [ ...prev, data ]);
        }
    });
    const handleSubmit = useCallback(async (data: FormSearchType) =>
    {

        await addTagAsync({
            ...data,
            id_site : site!.id_site,
            id_tag : tag ? tag.id_tag : undefined
        });
    }, [ addTagAsync, site, tag ])
    useEffect(() => {
        if (tag)
        {
            methods.setValue("nm_slug", tag?.nm_slug)
        }
    }, [tag, methods]);
    return (
        <FormProvider { ...methods }>
            <>
                <form
                    id={"form_create_tag"}
                    name={"form_create_tag"}
                    ref={formRef}
                    onSubmit={methods.handleSubmit(handleSubmit)}
                    className={"w-full p-4 relative h-full"}
                >
                    <h4 className={"text-2xl font-bold py-2 border-b border-zinc-200  "}>
                        {tag ? "Editar tag" : "Cadastrar tag"}
                    </h4>
                    <HookFormInput<keyof FormSearchType>
                        name={"nm_slug"}
                        placeholder={"Nome da tag"}
                        id={"nm_slug"}
                        icon={Tag}
                    />

                </form>
                <footer className={"self-end flex items-center gap-2 absolute bottom-2 right-2 flex-row-reverse"}>
                    <Button
                        form={"form_create_tag"}
                        className={"p-2 px-3 rounded-lg flex items-center  "}
                        type={'submit'}
                        isLoading={isPending}
                        disabled={isPending}
                        icon={Send}
                        title={tag ? "Editar" : "Cadastrar"}
                    />
                    <Button
                        className={` p-2 px-3 bg-blue-500 hover:bg-blue-600 ${tag ? "" : "hidden"}`}
                        icon={Ban}
                        title={"Cancelar"}
                        description={"Cancelar edição"}
                        onClick={() => {
                            if (setTagToEdit)
                            {
                                setTagToEdit(undefined);
                                methods.setValue("nm_slug", "")
                            }
                        }}
                    />
                </footer>
            </>

        </FormProvider>

    );
}