import { Noticia } from "../@types/News";
import { SwiperSlide } from "swiper/react";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SlideNewsProps 
{
    news : Partial<Noticia>
}
export const SlideNews = ({ news } : SlideNewsProps) => 
{
    const navigate = useNavigate();
    return (
        <SwiperSlide>
            <img
                alt={"imagem da noticia"}
                src={news.url_thumbimg ? news.url_thumbimg : news.images && news.images[0].url ? news.images[0].url : "" }
            />
            <footer className="absolute bottom-2 left-2 ">
                <h2 className="font-bold text-2xl">{news.nm_titulo}</h2>
                <Button 
                    onClick={() => navigate(`noticia/${news.id_noticia}`)}
                    title="Saiba mais"
                    icon={ArrowRight}
                    className="rounded-full shadow-lg"
                />
            </footer>
        </SwiperSlide>
    );
}