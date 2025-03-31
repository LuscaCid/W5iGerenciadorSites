import {useCallback} from "react";
import {Banner} from "../@types/Banner";
import {api} from "../services/api.ts";
import {useSiteContext} from "../store/site.ts";

export const useBanners = () => {
    const PATH_NAME = "banner"
    const site = useSiteContext(state => state.site);

    const save = useCallback(async(payload : FormData) => {
        const response = await api.post(PATH_NAME, payload);
        return response.data as Banner;
    } ,[]);

    const remove = useCallback(async(id : number) => {
        const response = await api.delete(PATH_NAME + `/${id}`);
        return response.data;
    }, []);

    const getBanners = useCallback(async() => {
        const response = await api.get(`${PATH_NAME}/${site!.id_site!}`);
        return response.data as Banner[];
    } ,[site]);

    return {
        save,
        remove,
        getBanners
    };
}