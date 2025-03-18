import {useCallback} from "react";
import {api} from "../services/api.ts";
import {Tag} from "../@types/Tag";
interface CreateTagDto {
    nm_slug : string;
}
export const useTags = () => {
    const PATH_NAME = "tag";

    const getTags = useCallback(async(search: string) => {
        const response = await api.get(`${PATH_NAME}?nm_slug=${search}`);
        return response.data;
    }, []);

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