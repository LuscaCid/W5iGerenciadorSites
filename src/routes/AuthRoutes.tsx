import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Main } from "../layout/Main";

export function AuthRoutes () 
{
    return (
        <Routes>
            <Route element={<Main />} path="/">
                <Route element={<Home />} path="/" />
                
            </Route>
        </Routes>
    );
}