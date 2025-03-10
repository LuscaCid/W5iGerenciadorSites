import { ArrowRight, ThumbsDown, ThumbsUp } from "lucide-react";
import { Noticia } from "../@types/News";
import { Button } from "../UI/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
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

    return (
        <div className="relative cursor-pointer  overflow-hidden rounded-b-2xl ">
            <header className="flex gap-2 items-center absolute z-20 top-2 left-2">
                { 
                    news.tags && news.tags.length > 0 && news.tags.map((tag) => (
                        <Tooltip
                            title={`Pressione para encontrar notícias sobre "${tag.nm_slug}"`}
                            enterDelay={300}
                            enterNextDelay={300}
                            key={tag.nm_slug} 
                        >
                            <span 
                                className="rounded-full px-2 text-white py-1 text-xs bg-slate-400/70 backdrop-blur-md"
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
                className={` ${titleOutside ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"}  shadow-lg brightness-50 hover:brightness-80 transition duration-200 w-full aspect-video `}
            />
            <footer className={`${titleOutside ? "bg-zinc-100 rounded-b-2xl px-2 py-4 relative  h-full" : "absolute bottom-2 left-2 "}  w-full flex flex-col gap-2`}>
                <h2 
                    onClick={() => navigate(`/noticia/${news.id_noticia}`)}
                    className={`font-bold  text-${titleSize} ${titleOutside ? "w-[80%]" : "w-[75%]"}  text-${textColor} hover:underline`}
                >
                    {news.nm_titulo}
                </h2>
                {
                    titleOutside && (
                        <>
                            <p className="">
                                {news.ds_subtitulo}
                            </p>
                            <div className="flex items-center gap-1 absolute top-2 right-2 z-30">
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
                    className={`absolute right-3 bottom-2 p-1 self-end w-fit flex-row-reverse items-center gap-1 px-2 text-sm  bg-transparent hover:bg-transparent  rounded-none border-b border-b-transparent ${titleOutside ? " hidden" : "text-white hover:border-b-zinc-50 "}`}
                    to={`/noticia/${news.id_noticia}`}
                >
                    Saiba mais
                </NavLink>
          
            </footer>
        </div>
    );
}