import {useSiteContext} from "../store/site.ts";
import {useCallback} from "react";
import {api} from "../services/api.ts";
import {Link} from "../@types/Link";
import {Noticia} from "../@types/News";
import {Faq} from "../@types/Faq";

export interface SiteDataReturn {
    id_site: number;
    nm_site: string;
    dt_cadastro: string;
    links: Link[],
    news : Noticia[],
    faqs : Faq[]
}
export const useSite = () => {
    const PATH_NAME = 'site';

    const site = useSiteContext(state => state.site);

    const getAllSiteData = useCallback(async (query : string) => {
        const response = await api.get(`${PATH_NAME}/all-page?query=${query}&id_site=${site!.id_site}`);
        return response.data as SiteDataReturn|undefined;
    } , [site]);
    return {
        getAllSiteData
    }
}