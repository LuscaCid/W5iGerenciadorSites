import { BrowserRouter } from "react-router-dom";
import { useUserContext } from "../store/user";
import { AppRoutes } from "./App.routes";
import {useEffect} from "react";
import {api} from "../services/api.ts";
import {useSiteContext} from "../store/site.ts";
import {StorageKeys} from "../constants/StorageKeys.ts";
import {User} from "../@types/User";

export function Router ()
{
    const { setUser } = useUserContext();
    const setSite = useSiteContext(state => state.setSite);

    setSite({
        id_site : import.meta.env['VITE_SITE_CHAVE'],
        nm_site : import.meta.env['VITE_SITE_NOME'],
    })

    useEffect(() => {
        const userInLocalStorage = window.localStorage.getItem(StorageKeys.user);
        if (userInLocalStorage)
        {
            const object = JSON.parse(userInLocalStorage) as User;

            const token = object.access_token;
            api.defaults.headers.authorization = "Bearer " + token;

            setUser(object);
        }
    }, [ setUser, api ]);

    return (
        <BrowserRouter basename={"/w5i-tecnologia-acesso-2025"}>
            <AppRoutes />
        </BrowserRouter>
    );
}