import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Controller } from 'swiper/modules';
import { Noticia } from "../@types/News";
import { NewsCard } from "./NewsCard";
import { Tooltip } from "@mui/material";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import 'swiper/css';
import {useNavigate} from "react-router-dom";
import {useNewsTagsContext} from "../store/newsTags.ts";
import {useCallback} from "react";
import {Tag} from "../@types/Tag";
interface Props 
{
    news : Noticia[]
}
export const NewsCarousel = ({ news } : Props) => 
{
    const navigate = useNavigate();

    const setSelectedTags = useNewsTagsContext(state => state.setSelectedTags);

    const handleNavigateToNewsWithTagFilter = useCallback((tag: Tag) => {
        setSelectedTags([tag]);
        navigate("/noticias")
    } ,[ navigate, setSelectedTags ])
    return(
    <section className="flex-col md:flex-row flex gap-5 items-start mb-6 h-full">
        <Swiper
            modules={[Autoplay, Navigation, Controller]}
            slidesPerView={1}
            autoplay={{ delay: 7000 }}
            spaceBetween={20}
            navigation={true}
            grabCursor
            className="w-full md:w-2/3 h-full"
        >
            {
                news.length > 0 && 
                    news.map((fake) => (
                        <SwiperSlide  
                            className="w-full"
                            key={fake.id_noticia}
                        >
                            <NewsCard news={fake} textColor="white"/> 
                        </SwiperSlide>
                    )
                )
            }
        </Swiper>
        <aside className="w-full md:w-1/3  h-full border-l border-zinc-200  dark:border-zinc-700/70 p-4">
            {
                news && news.length > 0 && (
                    news.map((n, idx) => (
                        <div key={n.id_noticia + n.ds_conteudo} className="flex flex-col gap-5">
                            {n.tags && n.tags.length > 0 && idx < 4 && (
                                <Tooltip
                                    enterDelay={300}
                                    enterNextDelay={300}
                                    title={`Ver mais noticias sobre ${n.tags[0].nm_slug}`}
                                >
                                    <div
                                        onClick={() => handleNavigateToNewsWithTagFilter(n.tags![0])}
                                        className="flex flex-col w-fit gap-1 mt-5 group cursor-pointer"
                                    >
                                        <p>
                                            {n.tags[0].nm_slug}
                                        </p>
                                        <div className="h-0.5 bg-zinc-950 dark:bg-zinc-700 w-6 max-w-1/4 group-hover:w-72 transition-all  duration-200 "/>
                                    </div>
                                </Tooltip>
                            )}
                            <h1 className="font-bold">{n.nm_titulo}</h1>
                        </div>
                    ))
                )
            }
        </aside>
    </section>
    ); 
}
