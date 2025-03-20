import { BrowserRouter } from "react-router-dom";
import { useUserContext } from "../store/user";
import { AppRoutes } from "./App.routes";
import {useEffect} from "react";
import {api} from "../services/api.ts";
import {useSiteContext} from "../store/site.ts";

export function Router ()
{
    const { user, setUser } = useUserContext();
    const setSite = useSiteContext(state => state.setSite);

    setSite({
        id_site : import.meta.env['VITE_SITE_CHAVE'],
        nm_site : import.meta.env['VITE_SITE_NOME'],
    })
    useEffect(() => {
        if (user){
            window.localStorage.setItem('@gerenciador-user', JSON.stringify(user));

            api.interceptors.request.use(
                async (config) => {
                    const token = user.access_token;
                    config.headers["authorization"] = "Bearer " + token;
                    return config;
                },
                error => {
                    console.log(error);
                }
            )
        }
    }, [ user ]);
    useEffect(() => {
        const userInLocalStorage = window.localStorage.getItem("@gerenciador-user");
        if (userInLocalStorage)
        {
            const object = JSON.parse(userInLocalStorage);
            setUser(object);
        }
    }, [ setUser ]);
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}