import { Route, Routes } from "react-router-dom";
import { Main } from "../layout/Main";
import { Home } from "../pages/Home";
import { News } from "../pages/News";
import { NewsDetail } from "../pages/NewsDetail";

export function AdminRoutes () 
{
    return (
        <Routes>
            <Route element={<Main />}>
                <Route element={<Home />} path="/" />
                <Route element={<News />} path="/noticias" />
                <Route element={<NewsDetail />} path="/noticia/:id" />
            </Route>
        </Routes>
    );
}