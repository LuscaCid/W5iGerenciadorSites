import * as Dialog from "@radix-ui/react-dialog";
import {DialogTitle} from "@radix-ui/react-dialog";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import z from "zod";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useTags} from "../hooks/useTags.ts";
import {HookFormInput} from "../UI/FormInput.tsx";
import {Button} from "../UI/Button.tsx";
import {Search, X} from "lucide-react";
import {Tag} from "../@types/Tag";
import {getTagsActions} from "../@shared/TagsActions.ts";
import {Tag as TagComponent} from "./Tag.tsx";
import {FormCreateTag} from "./FormCreateTag.tsx";
import {TextButton} from "../UI/TextButton.tsx";

const formSearchSchema = z.object({
    search : z.string().min(2, "Mínimo de 2 caracteres para buscar")
})
type FormSearchType = z.infer<typeof formSearchSchema>;
interface Props {
    selectedTags : Array<Tag>;
    setSelectedTags : Dispatch<SetStateAction<Array<Tag>>>;
}
export const TagSearchDialog = ({ setSelectedTags, selectedTags } : Props) => {
    const { getTags } = useTags();
    const { handleSelectTag } = getTagsActions({ selectedTags, setSelectedTags });

    const queryClient = useQueryClient();
    const [ debounce, setDebounce ] = useState(false);

    const methods = useForm<FormSearchType>({
        resolver : zodResolver(formSearchSchema),
        defaultValues : {
            search : ""
        }
    })
    const searchWatched = methods.watch("search");
    const formRef = useRef<HTMLFormElement|null>(null);

    const { data : tags, isLoading } = useQuery({
        queryFn : async () => getTags(searchWatched),
        queryKey : ["tags"],
        refetchOnWindowFocus : false,
        enabled : searchWatched.length == 0 || !debounce
    })

    useEffect(() => {
        if (searchWatched)
        {
            setDebounce(true);
            const timeout = setTimeout(() => setDebounce(false), 800);
            return () => clearTimeout(timeout);
        }
        setDebounce(false);
    }, [searchWatched]);

    useEffect(() => {
        if (!debounce)
        {
            queryClient.invalidateQueries({queryKey : ["tags"]});
        }
    }, [ debounce, queryClient ]);
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
    const handleSearch = useCallback( async() => {
        await queryClient.invalidateQueries({queryKey : ["tags"]})
    }, [queryClient]);
    return (
        <Dialog.Content className={"fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-auto rounded-2xl border flex flex-col lg:flex-row gap-2 w-[95%] h-[95%] lg:w-[60%] lg:h-[40%]    z-[100] border-zinc-200 bg-zinc-100 "}>
            <Dialog.Close
                asChild
            >
                <TextButton
                    className={"absolute z-50 top-2 right-2 hover:bg-red-500 transition duration-200 items-center justify-center flex rounded-lg bg-red-400  cursor-pointer"}
                    icon={X}
                    type={"button"}
                    iconSize={15}
                />

            </Dialog.Close>
            <main className={"w-full h-2/3 lg:h-full lg:w-2/3 relative p-4  "}>
                <DialogTitle className={"text-2xl sr-only"}>
                    Procurar Tags
                </DialogTitle>

                <h4 className={"text-2xl font-bold py-2 border-b border-zinc-200  "}>
                    Selecione tags
                </h4>
                <FormProvider {...methods}>
                    <form
                        className={"w-full"}
                        onSubmit={methods.handleSubmit(handleSearch)}
                    >
                        <HookFormInput<keyof FormSearchType>
                            id={"search"}
                            name={"search"}
                            className={"w-full"}
                            placeholder={"Pesquisar por tags"}
                        />
                        <Button
                            type={"submit"}
                            disabled={isLoading || selectedTags.length == 0}
                            isLoading={isLoading}
                            icon={Search}
                            title={selectedTags.length > 0 ? "Enviar" : "Selecione uma tag"}
                            className={"p-2 px-3 rounded-lg hover:bg-green-600 bg-green-500 flex items-center flex-row-reverse self-end absolute bottom-2 right-2"}
                        />
                    </form>
                </FormProvider>

                <footer className={"flex flex-wrap gap-2  max-h-[350px]  "}>
                    {
                        tags && tags.length > 0 && (
                            tags.map((tag : Tag) => (
                                <TagComponent
                                    key={tag.id_tag}
                                    selectedTags={selectedTags}
                                    tag={tag}
                                    handleSelectTag={handleSelectTag}
                                />
                            ))
                        )
                    }
                </footer>
            </main>
            <div className={"w-full h-[1px] lg:h-full lg:w-[1px] bg-zinc-200"} />
            <aside className={"w-full h-1/3  lg:h-full lg:w-1/3"}>
                <FormCreateTag />
            </aside>
        </Dialog.Content>
    );
}