import { api } from "../services/api"
import {Noticia} from "../@types/News";
import {useSiteContext} from "../store/site.ts";

export interface GetNewsDto {
    page? : number;
    nm_titulo? : string;
    tags? : string
}
/**
 * @summary 
 * @returns 
 */
export function useNews () 
{
    const PATH_NAME = 'news';
    const site = useSiteContext((state) => state.site)
    async function postNews (data : FormData)
    {   
        const response = await api.post(`/${PATH_NAME}/`, data);
        return response.data;
    }
    async function getNews (payload : GetNewsDto)
    {
        const response = await api.get(`/${PATH_NAME}?page=${payload.page}&tags=${payload.tags}&nm_titulo=${payload.nm_titulo}&id_site=${site!.id_site}`);
        return response.data as { news : Noticia[] };
    }

    async function deleteNews (id : number)
    {
        try {
            await api.delete(`${PATH_NAME}/${id}`);
        } catch (e) {
            console.log(e);
        }
    }
    return {
        getNews, 
        postNews,
        deleteNews
    }
}
