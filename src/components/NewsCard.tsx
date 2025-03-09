import { ArrowRight } from "lucide-react";
import { Noticia } from "../@types/News";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
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
        <div className="relative cursor-pointer">
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
                src={news.nm_img} 
                className="rounded-2xl brightness-50 hover:brightness-80 transition duration-200 w-full aspect-video "
            />
            <footer className={`${titleOutside ? "" : "absolute"}  w-full bottom-2 left-2 flex flex-col gap-2`}>
                <h2 className={`font-bold text-${titleSize}  w-[80%] text-${textColor}`}>
                    {news.nm_titulo}
                </h2>
                <Button 
                    onClick={() => navigate(`noticia/${news.id_noticia}`)}
                    title="Saiba mais"
                    icon={ArrowRight}
                    className={`absolute right-3 bottom-2 p-1 self-end w-fit flex-row-reverse items-center gap-1 px-2 text-sm  bg-transparent hover:bg-transparent  rounded-none border-b border-b-transparent ${titleOutside ? " hidden" : "text-white hover:border-b-zinc-50 "}`}
                />
            </footer>
        </div>
    );
}