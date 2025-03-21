import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Main } from "../layout/Main";
import { AdminLogin } from "../pages/AdminLogin";
import { News } from "../pages/News";
import { NewsDetail } from "../pages/NewsDetail";
import { Government } from "../pages/Governo";
import { Municipio } from "../pages/Municipio";
import {NotFound} from "../pages/404.tsx";

export function AppRoutes () 
{
    return (
        <Routes>
            <Route element={<Main />} path="/">
                <Route element={<Home />} path="/" />
                <Route element={<News />} path="/noticias" />
                <Route element={<Government />} path="/governo" />
                <Route element={<Municipio />} path="/municipio" />
                <Route element={<NewsDetail />} path="/noticia/:id" />
                <Route element={<NewsDetail />} path="/noticia/" />
                <Route element={<AdminLogin />} path="/login" />
                <Route element={<NotFound/> } path="*"/>
            </Route>
        </Routes>
    );
}