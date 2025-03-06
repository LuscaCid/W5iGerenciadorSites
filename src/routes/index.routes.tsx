import { BrowserRouter } from "react-router-dom";
import { useUserContext } from "../store/user";
import { AdminRoutes } from "./Admin.routes";
import { AppRoutes } from "./App.routes";

export function Router () 
{
    const user = useUserContext(state => state.user);
    return (
        <BrowserRouter>
            {
                user ? <AdminRoutes /> : <AppRoutes />
            }
        </BrowserRouter>
    );
}