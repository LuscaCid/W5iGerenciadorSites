import {useSiteContext} from "../store/site.ts";
import {useCallback} from "react";
import {api} from "../services/api.ts";
import {Faq} from "../@types/Faq";
import {useSearchParams} from "react-router-dom";

export function useFaqs ()
{
    const PATH_NAME = 'faq';
    const site = useSiteContext(state => state.site);
    const [ searchParams ] = useSearchParams();

    const getFaqs = useCallback(async() =>  {
        const query = searchParams.get("query") ?? "";
        const page = searchParams.get("page") ?? 1;

        const response = await api.get(`${PATH_NAME}?query=${query}&page=${page}&id_site=${site!.id_site}`);
        return response.data ?? [] ;
    }, [ site, searchParams ]);

    const addFaq = useCallback(async(payload : Faq) => {
        const response = await api.post(`${PATH_NAME}/`, payload);
        return response.data;
    }, []);
    const deleteFaq = useCallback(async(id : number) => {
        const response = await api.delete(`${PATH_NAME}/${id}`);
        return response.data;
    }, []);
    return {
        getFaqs,
        deleteFaq,
        addFaq
    }
}