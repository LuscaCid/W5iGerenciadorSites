import {useSiteContext} from "../store/site.ts";
import {api} from "../services/api.ts";
import {useCallback} from "react";

export const useGovernment = () => {
    const PATH_NAME = 'government';
    const site = useSiteContext((state) => state.site)

    const createSiteGovernment = useCallback(async(data : FormData) => {
        const response = await api.post(PATH_NAME, data)
        return response.data;
    }, []);

    const updateSiteGovernment = useCallback(async (data : FormData) => {
        const response = await api.patch(PATH_NAME, data)
        return response.data;
    }, []);

    const deleteSiteGovernment = useCallback(async() => {
        const response = await api.delete(`${PATH_NAME}/${site!.id_site}`);
        return response.data;
    }, [site]);

    const getSiteGovernmentData = useCallback(async () => {
        const response = await api.get(`${PATH_NAME}/${site!.id_site}`);
        return response.data;
    }, [site]);

    return {
        getSiteGovernmentData,
        createSiteGovernment,
        updateSiteGovernment,
        deleteSiteGovernment,
    }
}