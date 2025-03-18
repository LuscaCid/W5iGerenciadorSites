import { api } from "../services/api"
import {Tag} from "../@types/Tag";
import {Noticia} from "../@types/News";

export interface GetNewsDto {
    id_site : number;
    page : number;
    nm_titulo? : string;
    tags? : Tag[]
}
/**
 * @summary 
 * @returns 
 */
export function useNews () 
{
    const PATH_NAME = 'news';
    async function postNews (data : FormData)
    {   
        const response = await api.post(`/${PATH_NAME}/`, data);
        return response.data;
    }
    async function getNews (payload : GetNewsDto)
    {
        const response = await api.get(`/${PATH_NAME}?page=${payload.page}&tags=${payload.tags?.join(',')}&nm_titulo=${payload.nm_titulo}&id_site=${payload.id_site}`);
        return response.data as { news : Noticia[] };
    }

    async function deleteNews (id : number)
    {
        await api.delete(`${PATH_NAME}/${id}`);
    }
    return {
        getNews, 
        postNews,
        deleteNews
    }
}
