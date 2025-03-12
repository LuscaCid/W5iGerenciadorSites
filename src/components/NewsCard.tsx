import { Pencil, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import { Noticia } from "../@types/News";
import { Button } from "../UI/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useUserContext } from "../store/user";
interface NewsCardProps
{
    news : Partial<Noticia>
    titleSize? : string;
    titleOutside? : boolean;
    textColor? : string;
}
export function NewsCard (props : NewsCardProps) 
{
    const { news, titleSize = '2xl', titleOutside = false, textColor = "black" } = props;
    const navigate = useNavigate();
    const user = useUserContext((state) => state.user);
    return (
        <div className="relative max-h-[380px] overflow-hidden rounded-b-2xl  rounded-t-2xl  group">
            <header className="flex gap-2 items-center absolute z-20 top-3 left-3">
                { 
                    news.tags && news.tags.length > 0 && news.tags.map((tag) => (
                        <Tooltip
                            title={`Pressione para encontrar notícias sobre "${tag.nm_slug}"`}
                            enterDelay={300}
                            enterNextDelay={300}
                            key={tag.nm_slug}
                        >
                            <span 
                                className="rounded-full px-2 text-white py-1 text-xs bg-slate-400/70 hover:bg-slate-800/70 transition duration-150 backdrop-blur-md cursor-pointer"
                            >
                                { tag.nm_slug }
                            </span>
                        </Tooltip>
                    ))
                }
            </header>
            <img 
                onClick={() => navigate(`/noticia/${news.id_noticia}`)}
                src={news.nm_img} 
                className={` ${titleOutside ? "group-hover:scale-105 rounded-t-2xl rounded-b-none cursor-pointer" : "rounded-2xl"}  shadow-lg brightness-50 hover:brightness-80 transition duration-200 w-full aspect-video `}
            />
            <footer className={`${titleOutside ? "bg-zinc-100 rounded-b-2xl px-3 py-5 h-full relative max-h-[192px]" : "absolute bottom-2 left-2 "}  w-full flex flex-col gap-2`}>
                <h2 
                    onClick={() => navigate(`/noticia/${news.id_noticia}`)}
                    className={`font-bold cursor-pointer overflow-ellipsis overflow-hidden text-${titleSize} ${titleOutside ? "w-[80%]" : "w-[75%]"}  text-${textColor} hover:underline`}
                >
                    {news.nm_titulo}
                </h2>
                {
                    titleOutside && (
                        <>
                            <p className={`${user ? "w-[90%]" : "w-full"}`}>
                                {news.ds_subtitulo}
                            </p>
                            <div className="flex items-center gap-1 absolute top-2 right-3 z-30">
                                <Button 
                                    icon={ThumbsUp}
                                    onClick={() => console.log()}
                                    className="p-1"
                                />
                                <Button 
                                    icon={ThumbsDown}
                                    onClick={() => console.log()}
                                    className="p-1"
                                />
                            </div>
                        </>
                    )
                }
                <NavLink 
                    className={`absolute right-3 bottom-2 p-1 self-end w-fit flex-row-reverse items-center gap-1 px-2 text-sm  bg-transparent hover:bg-transparent  rounded-none border-b border-b-transparent ${titleOutside ? " hidden " : "text-white hover:border-b-zinc-50 "}`}
                    to={`/noticia/${news.id_noticia}`}
                >
                    Saiba mais
                </NavLink>
                {
                    user && (
                        <section className="absolute top-10 right-3 flex flex-col gap-2">
                            <Tooltip
                                enterDelay={300}
                                title="Editar notícia"
                            >
                                <NavLink 
                                    className={"rounded-lg bg-blue-400 text-zinc-50 hover:bg-blue-500 transition duration-300 p-2 flex items-center justify-center shadow-lg"} 
                                    to={`/noticia/${news.id_noticia}`}
                                >
                                    <Pencil size={16} />
                                </NavLink>
                            </Tooltip>
                            <Tooltip
                                enterDelay={300}
                                title="Excluir notícia"
                            >
                                <Button 
                                    onClick={() => console.log("a")}
                                    icon={Trash}
                                    className="bg-red-400 p-2 text-zinc-50 transition duration-300 hover:bg-red-500 shadow-lg"
                                />
                            </Tooltip>
                        </section>
                    )
                }
            </footer>
        </div>
    );
}