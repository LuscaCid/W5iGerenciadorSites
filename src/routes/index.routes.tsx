import { BrowserRouter } from "react-router-dom";
import { useUserContext } from "../store/user";
import { AppRoutes } from "./App.routes";

export function Router () 
{
    const setUser = useUserContext(state => state.setUser);
    // setUser({nm_email : "lucasfelipaaa@gmail.com", nm_usuario : "Lucas Cid"})
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}