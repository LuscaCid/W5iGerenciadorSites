import {Noticia} from "../@types/News";
import {useCallback} from "react";
import {useNewsTagsContext} from "../store/newsTags.ts";
import {Tag} from "../@types/Tag";
import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {Button} from "../UI/Button.tsx";
import {FacebookIcon, Instagram} from "lucide-react";

interface  Props {
    news : Noticia
}
export const NewsDetailClient = ({ news } : Props) => {

    const setSelectedTags = useNewsTagsContext((state) => (state.setSelectedTags))
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleSelectTag = useCallback(async(tag : Tag) => {

        setSelectedTags([tag]);
        await queryClient.invalidateQueries({queryKey : ["news"]});

        navigate("/noticias");
    }, [ setSelectedTags, queryClient, navigate ]);
    return (
        <>
            <header className={"relative max-h-[600px] group rounded-2xl"}>
                <img
                    alt={"imagem da noticia"}
                    src={news.url_thumbimg}
                    className="w-full rounded-2xl max-h-[600px]  shadow-lg object-cover brightness-50 group-hover:brightness-90 transition duration-150"
                />
                <main className={'flex flex-col gap-10 absolute top-1/2 left-1/2 -translate-x-1/2 w-[80%] -translate-y-1/2'}>
                    <h1 className="font-[600] text-2xl lg:text-4xl  text-zinc-100 group-hover:opacity-0 transition duration-150">
                        {news?.nm_titulo}
                    </h1>

                </main>
                <section className={"flex items-center gap-2  absolute bottom-4 right-4"}>
                    <Button
                        description={"Compartilhar no Facebook"}
                        className={"rounded-full items-center justify-center h-8 w-8 lg:h-10 lg:w-10 p-0"}
                        icon={FacebookIcon}
                    />
                    <Button
                        description={"Compartilhar no Instagram"}
                        className={"rounded-full items-center justify-center h-8 w-8 lg:h-10 lg:w-10 p-0"}
                        icon={Instagram}
                    />
                </section>
                <section className={" top-3 left-3 flex items-center absolute flex-wrap  gap-2  group-hover:opacity-50 transition duration-150"}>
                    {
                        news.tags && news.tags.length > 0 && (
                            news.tags.map((tag) => (
                                <span
                                    onClick={() => handleSelectTag(tag)}
                                    key={tag.id_tag}
                                    className={"rounded-full flex text-xs lg:text-md text-nowrap items-center bg-zinc-200/60 backdrop-blur-md  hover:bg-zinc-300 hover:opacity-100 font-semibold  py-0.5 px-1  lg:py-1 lg:px-2 cursor-pointer gap-2    transition duration-150"}
                                >
                                    {tag.nm_slug}
                                </span>
                            ))
                        )
                    }
                </section>
            </header>

            <h3 className="text-2xl font-[600] text-zinc-600">
                {news?.ds_subtitulo}
            </h3>
            <p className="text-md text-zinc-500">
                {
                    news?.ds_conteudo
                }
            </p>
            {
                news.images.length > 0 && (
                    news.images.map((img) => (
                        img.url !== news.url_thumbimg && <img
                            key={img.key}
                            src={img.url}
                            alt={"Imagem da notícia"}
                            className={"w-full rounded-2xl shadow-lg"}
                        />
                    ))
                )
            }

        </>
    )
}