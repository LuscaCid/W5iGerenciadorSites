import {QueryClient} from "@tanstack/react-query";
import {Noticia} from "../@types/News";
import {Tag} from "../@types/Tag";
import {CreateTagDto} from "../hooks/useTags.ts";

interface Props {
    queryClient : QueryClient
}
export const updateTagsStateActions = ({ queryClient } : Props) => {

    function updateTagsInNewsState (tag : Tag, variables: CreateTagDto)
    {
        queryClient.setQueryData(["news"], (prev : Noticia[]) => (
            prev.map((newsPrev) => ({
                ...newsPrev,
                tags : newsPrev.tags ? newsPrev.tags.map(prevTag => {
                    if (prevTag.id_tag == tag.id_tag)
                    {
                        return { ...prevTag, nm_slug : variables.nm_slug } as Tag
                    }
                    return tag;
                }) : [],
            } as Noticia))
        ))
    }
    function updateTagsState (tag : Tag, variables: CreateTagDto)
    {
        queryClient.setQueryData(["tags"],
            (prev : Tag[]) => prev.map(prevTag => {
                if (prevTag.id_tag == tag.id_tag) {
                    return {
                        ...tag,
                        nm_slug : variables.nm_slug,
                    } as Tag;
                }
                return prevTag;
            }));

    }
    return {
        updateTagsInNewsState,
        updateTagsState
    }
}