import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Controller } from 'swiper/modules';
import { Button } from "../UI/Button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Noticia } from "../@types/News";
import 'swiper/css';
import "swiper/css/navigation";
import { NewsCard } from "./NewsCard";
interface Props 
{
    news : Noticia[]
}
export const NewsCarousel = ({ news } : Props) => 
{
    
    return(
        <section className="flex">
            <aside className="w-1/2">

            </aside>
            <Swiper
                modules={[Autoplay, Navigation, Controller]}
                slidesPerView={1}
                autoplay={{ delay: 7000 }}
                spaceBetween={0}
                navigation={true}
                grabCursor
                className="w-1/2"
            >
                {
                    news.length > 0 && 
                        news.map((fake) => (
                            <SwiperSlide  
                                className="w-full"
                                key={fake.id_noticia}
                            >
                                <NewsCard  news={fake}/> 
                            </SwiperSlide>
                        )
                    )
                }
            </Swiper>
        </section>
    ); 
}
