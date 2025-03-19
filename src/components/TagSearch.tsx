import {DialogTitle} from "@radix-ui/react-dialog";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useTags} from "../hooks/useTags.ts";
import {Button} from "../UI/Button.tsx";
import {Search} from "lucide-react";
import {Tag} from "../@types/Tag";
import {getTagsActions} from "../@shared/TagsActions.ts";
import {Tag as TagComponent} from "./Tag.tsx";
import {FormCreateTag} from "./FormCreateTag.tsx";
import { Input } from '../UI/Input.tsx';
import {CustomDialogContent} from "./CustomDialogContent.tsx";

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
    const [ tagToEdit , setTagToEdit ] = useState<Tag|undefined>();

    const { data : tags, isLoading } = useQuery({
        queryFn : async () => getTags(query),
        queryKey : ["tags"],
        refetchOnWindowFocus : false,
        enabled : query.length == 0 || !debounce
    })
    const handleSelectTagToEdit = useCallback((tag: Tag) => {
        setTagToEdit(tag);
    }, [ setTagToEdit ])

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
        <CustomDialogContent>
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
                                    handleEditTag={handleSelectTagToEdit}
                                    canOpen={false}
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
                <FormCreateTag setTagToEdit={setTagToEdit} tag={tagToEdit}/>
            </aside>
        </CustomDialogContent>
    );
}