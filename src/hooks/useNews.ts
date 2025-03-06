import { api } from "../services/api"

export function useNews () 
{
    const PATH_NAME = 'news';
    async function postNews () 
    {
       
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