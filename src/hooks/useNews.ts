import { api } from "../services/api"

/**
 * @summary 
 * @returns 
 */
export function useNews () 
{
    const PATH_NAME = 'news';
    async function postNews () 
    {   
        const response = await api.post(`${PATH_NAME}/`);
        return response.data;
    }
    async function getNews () 
    {
        const response = await api.get(`${PATH_NAME}/`);
        return response.data;
    }
    return {
        getNews, 
        postNews
    }
} 