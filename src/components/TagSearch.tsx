import * as Dialog from "@radix-ui/react-dialog";
import {DialogTitle} from "@radix-ui/react-dialog";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useTags} from "../hooks/useTags.ts";
import {Button} from "../UI/Button.tsx";
import {Search, X} from "lucide-react";
import {Tag} from "../@types/Tag";
import {getTagsActions} from "../@shared/TagsActions.ts";
import {Tag as TagComponent} from "./Tag.tsx";
import {FormCreateTag} from "./FormCreateTag.tsx";
import {TextButton} from "../UI/TextButton.tsx";
import { Input } from '../UI/Input.tsx';

interface Props {
    selectedTags : Array<Tag>;
    setSelectedTags : Dispatch<SetStateAction<Array<Tag>>>;
    setDialogOpen : Dispatch<SetStateAction<boolean>>;
}
export const TagSearchDialog = ({ setSelectedTags, selectedTags, setDialogOpen } : Props) => {
    const { getTags } = useTags();
    const { handleSelectTag } = getTagsActions({ selectedTags, setSelectedTags });

    const queryClient = useQueryClient();
    const [ debounce, setDebounce ] = useState(false);
    const [ query, setQuery ] = useState("");

    const { data : tags, isLoading } = useQuery({
        queryFn : async () => getTags(query),
        queryKey : ["tags"],
        refetchOnWindowFocus : false,
        enabled : query.length == 0 || !debounce
    })

    useEffect(() => {
        if (query)
        {
            setDebounce(true);
            const timeout = setTimeout(() => setDebounce(false), 500);
            return () => clearTimeout(timeout);
        }
        queryClient.invalidateQueries({queryKey : ["tags"]});
        setDebounce(false);
    }, [query, queryClient]);

    useEffect(() => {
        if (!debounce)
        {
            queryClient.invalidateQueries({queryKey : ["tags"]});
        }
    }, [ debounce, queryClient ]);

    const handleSend = useCallback( async() => {
        setDialogOpen(false);
    }, [setDialogOpen]);
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
                <Input
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    id={"search"}
                    className={"w-full"}
                    placeholder={"Pesquisar por tags"}
                />
                <Button
                    type={"button"}
                    onClick={handleSend}
                    disabled={isLoading || selectedTags.length == 0}
                    isLoading={isLoading}
                    icon={Search}
                    title={selectedTags.length > 0 ? "Enviar" : "Selecione uma tag"}
                    className={"p-2 px-3 rounded-lg hover:bg-green-600 bg-green-500 flex items-center flex-row-reverse self-end absolute bottom-2 right-2"}
                />
                <footer className={"flex flex-wrap gap-2 mt-3  max-h-[350px]  "}>
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