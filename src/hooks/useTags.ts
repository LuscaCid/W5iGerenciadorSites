import {useCallback} from "react";
import {api} from "../services/api.ts";
import {Tag} from "../@types/Tag";
import {useSiteContext} from "../store/site.ts";
interface CreateTagDto {
    nm_slug : string;
    id_site : number;
    id_tag? : number;
}
export const useTags = () => {
    const PATH_NAME = "tag";
    const site = useSiteContext((state) => state.site)

    const getTags = useCallback(async(search?: string) => {
        const response = await api.get(`${PATH_NAME}?nm_slug=${search}&id_site=${site!.id_site}`);
        return response.data as Tag[];
    }, [site]);

    const addTag  = useCallback(async(payload : CreateTagDto) => {
        const response = await api.post(`${PATH_NAME}/`, payload);
        return response.data;
    }, []);

    const deleteTag = useCallback(async (id: number) => {
        const response = await api.delete(`${PATH_NAME}/${id}`);
        return response.data as Tag[];
    }, [])
    return {
        deleteTag,
        getTags,
        addTag
    }
}