import {useCallback} from "react";
import {useSiteContext} from "../store/site.ts";
import {api} from "../services/api.ts";
import {Link} from "../@types/Link";

export function useLinks() {
    const PATH_NAME = 'link';
    const site = useSiteContext(state => state.site);

    const getLinks = useCallback(async() => {
        const response = await api.get(`${PATH_NAME}/${site!.id_site}`);
        return response.data as Link[];
    }, [ site ]);

    const addLink = useCallback(async(payload : Link) => {
        const response = await api.post(`${PATH_NAME}/`, payload);
        return response.data;
    }, []);
    const deleteLink = useCallback(async(id : number) => {
        const response = await api.delete(`${PATH_NAME}/${id}`);
        return response.data;
    }, []);

    return {
        deleteLink,
        getLinks,
        addLink,
    }
}