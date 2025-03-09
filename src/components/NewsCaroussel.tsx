import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Controller } from 'swiper/modules';
import { Noticia } from "../@types/News";
import 'swiper/css';
import "swiper/css/navigation";
import { NewsCard } from "./NewsCard";
import { Tooltip } from "@mui/material";
interface Props 
{
    news : Noticia[]
}
export const NewsCarousel = ({ news } : Props) => 
{
    
    return(
    <section className="flex gap-10 items-center">
        <Swiper
            modules={[Autoplay, Navigation, Controller]}
            slidesPerView={1}
            autoplay={{ delay: 7000 }}
            spaceBetween={20}
            navigation={true}
            grabCursor
            className="w-2/3"
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
            <aside className="w-1/2">
                {
                    news && news.length > 0 && (
                        news.map((n) => (
                            <div className="flex flex-col gap-5">
                                {n.tags && n.tags?.length > 0 && (
                                    <Tooltip
                                        enterDelay={300}
                                        enterNextDelay={300}
                                        title={`Ver mais noticias sobre ${n.tags[0].nm_slug}`}
                                    >
                                        <div className="flex flex-col w-fit gap-1 mt-5 group cursor-pointer">
                                            <p>
                                                {n.tags[0].nm_slug}
                                            </p>
                                            <div className="h-0.5 bg-zinc-950 w-6 max-w-1/4 group-hover:w-72 transition-all  duration-200 "/> 
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
