import {useCallback} from "react";
import {api} from "../services/api.ts";
import {useSiteContext} from "../store/site.ts";
import {useSearchParams} from "react-router-dom";

export const useSecretariat = () => {
    const PATH_NAME = "secretariat";
    const site = useSiteContext(state => state.site);
    const [ searchParams ] = useSearchParams();

    const addSecretariat = useCallback(async () => {
        const response = await api.get(`${PATH_NAME}/`);
        return response.data;
    }, [])
    const getSecretariats = useCallback(async () => {
        const query = searchParams.get("query");
        const page = searchParams.get("page")
        const response = await api.get(`${PATH_NAME}/?query=${query}&id_site=${site!.id_site}&page=${page}`);
        return response.data;
    }, [site])
    const deleteSecretariat = useCallback(async (id : number) => {
        const response = await api.get(`${PATH_NAME}/${id}`);
        return response.data;
    }, [site])

    return {
        addSecretariat,
        getSecretariats,
        deleteSecretariat
    }
}