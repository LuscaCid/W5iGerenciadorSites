import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Controller } from 'swiper/modules';
import fakenoticias from "../constants/news";
import { Button } from "../UI/Button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import "swiper/css/navigation";

export const NewsCarousel = () => 
{
    const navigate = useNavigate();
    return(
        <section>
            <Swiper
                modules={[Autoplay, Navigation, Controller]}
                slidesPerView={3}
                autoplay={{ delay: 5000 }}
                spaceBetween={20}
                navigation={true}
                grabCursor
            >
                {
                    fakenoticias.length > 0 && 
                        fakenoticias.map((fake) => (
                            <SwiperSlide  
                                className="w-full"
                                key={fake.id_noticia}
                            >
                                <header className="flex gap-2 items-center absolute z-20 top-2 left-2">
                                    {fake.tags && fake.tags.length > 0 && fake.tags.map((tag) => (
                                        <span className="rounded-md px-2 text-white py-1 text-xs bg-purple-600">
                                            { tag.nm_slug }
                                        </span>
                                    ))}
                                </header>
                                <img 
                                    src={fake.nm_img} 
                                    className="brightness-50 hover:brightness-80 transition duration-200 w-full aspect-video"
                                />
                                <footer className="absolute bottom-2 left-2 flex flex-col gap-2">
                                    <h2 className="font-bold text-2xl text-white">{fake.nm_titulo}</h2>
                                    <Button 
                                        onClick={() => navigate(`noticia/${fake.id_noticia}`)}
                                        title="Saiba mais"
                                        icon={ArrowRight}
                                        className=" rounded-full p-1 w-fit flex-row-reverse items-center gap-1 px-2 text-sm text-white bg-blue-500 hover:bg-blue-600"
                                    />
                                </footer>
                            </SwiperSlide>
                        ))
                }
            </Swiper>

        </section>
    ); 
}