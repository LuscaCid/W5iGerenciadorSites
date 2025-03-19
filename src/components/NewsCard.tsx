import { Pencil, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import { Noticia } from "../@types/News";
import { Button } from "../UI/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useUserContext } from "../store/user";
import {useNewsTagsContext} from "../store/newsTags.ts";
import * as AlertDialog  from "@radix-ui/react-alert-dialog";
import {useCallback} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNews} from "../hooks/useNews.ts";
import {useToastContext} from "../store/toast.ts";
import {AlertDialogComponent} from "./AlertDialogComponent.tsx";

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
    const setSelectedTags = useNewsTagsContext(state => state.setSelectedTags);
    const openToast = useToastContext(state => state.open);
    const navigate = useNavigate();
    const { deleteNews } = useNews();
    const queryClient = useQueryClient();
    const { mutateAsync : deleteNewsAsync } = useMutation({
        mutationFn : deleteNews,
        mutationKey: ["delete-news"],
        onSuccess :(_, variables) => {
            queryClient.setQueryData(["news"], (prev : { news : Noticia[] }) => ({
                news : prev.news.filter(news => news.id_noticia != variables)
            }))
            openToast("Notícia excluída")
        },
    })
    const user = useUserContext((state) => state.user);
    const handleDeleteNews = useCallback(async(id : number) => {
        await deleteNewsAsync(id)
    }, [ deleteNewsAsync ])
    return (
        <div className="relative overflow-hidden h-full min-h-[340px] bg-zinc-100  rounded-b-2xl  rounded-t-2xl   group">
            <img
                alt={"Imagem de apresentacao da noticia"}
                onClick={() => navigate(`/noticia/${news.id_noticia}`)}
                src={news.url_thumbimg}
                className={` ${titleOutside ? "group-hover:scale-105 rounded-t-2xl rounded-b-none cursor-pointer" : "rounded-2xl"}  shadow-lg brightness-50 hover:brightness-80 transition duration-200 w-full aspect-video object-cover  `}
            />
            <header className="flex gap-1 items-center absolute flex-wrap z-20 top-3 left-3">
                { 
                    news.tags && news.tags.length > 0 && news.tags.map((tag) => (
                        <Tooltip
                            title={`Pressione para encontrar notícias sobre "${tag.nm_slug}"`}
                            enterDelay={300}
                            enterNextDelay={300}
                            key={tag.nm_slug}
                        >
                            <span
                                onClick={() => setSelectedTags([tag])}
                                className="rounded-full px-2 text-white py-1 text-nowrap text-xs bg-slate-400/40 hover:bg-slate-800/40 transition duration-150 backdrop-blur-md cursor-pointer"
                            >
                                { tag.nm_slug }
                            </span>
                        </Tooltip>
                    ))
                }
            </header>

            <footer className={`${titleOutside ? "bg-zinc-100 rounded-b-2xl px-3 py-5 h-full max-h-max  relative  " : "absolute bottom-2 left-2 "}  w-full flex flex-col gap-2`}>
                <h2 
                    onClick={() => navigate(`/noticia/${news.id_noticia}`)}
                    className={`font-bold cursor-pointer overflow-ellipsis text-${titleSize} ${titleOutside ? "w-[80%]" : "w-[75%]"}  text-${textColor} hover:underline`}
                >
                    {news.nm_titulo}
                </h2>
                {
                    titleOutside && (
                        <>
                            <p className={`${user ? "w-[90%]" : "w-full"} overflow-hidden overflow-ellipsis `}>
                                {news.ds_subtitulo}
                            </p>
                            <div className="flex items-center gap-1 absolute top-2 right-3 z-30">
                                <Button 
                                    icon={ThumbsUp}
                                    onClick={() => console.log()}
                                    className="p-1 text-xs bg-zinc-200/10 backdrop-blur-lg hover:bg-zinc-300"
                                    title={news.nu_like?.toString()}
                                />
                                <Button 
                                    icon={ThumbsDown}
                                    onClick={() => console.log()}
                                    className="p-1 bg-zinc-200/10 backdrop-blur-lg hover:bg-zinc-300"
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
                        <section className=" top-10 absolute right-3 flex flex-col gap-1">
                            <Tooltip
                                enterDelay={300}
                                title="Editar notícia"
                            >
                                <NavLink 
                                    className={"rounded-lg bg-blue-400 text-zinc-50 w-fit self-end hover:bg-blue-500 transition duration-300 p-2 flex items-center justify-center shadow-lg"}
                                    to={`/noticia/${news.id_noticia}`}
                                >
                                    <Pencil size={16} />
                                </NavLink>
                            </Tooltip>
                            <AlertDialog.Root >
                                <AlertDialog.Trigger asChild>
                                    <Button
                                        description={"Excluir notícia"}
                                        icon={Trash}
                                        className="bg-red-400 p-2 text-zinc-50 transition duration-300 self-end flex items-center justify-center w-fit hover:bg-red-500 shadow-lg"
                                    />
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal >
                                    <AlertDialog.Overlay/>
                                    <AlertDialogComponent
                                        action={() => handleDeleteNews(news.id_noticia!)}
                                        message="Deletar notícia?"
                                        buttonActionMessage="Excluir"
                                        title="Tem certeza?"
                                    />
                                </AlertDialog.Portal>
                            </AlertDialog.Root>
                        </section>
                    )
                }
            </footer>
        </div>
    );
}