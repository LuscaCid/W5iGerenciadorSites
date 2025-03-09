import { Noticia } from "../@types/News";
import { NewsCard } from "./NewsCard";

// import { useQuery } from "@tanstack/react-query";
interface Props {
    news : Noticia[]
}
export const NewsSection = ({ news } : Props) => 
{

    // renderizar as noticias com base na
    return (
        <div className="grid grid-cols-2 gap-2 w-2/3">
            {
                news && news.length > 0 && (
                    news.map((notice) => (
                        <NewsCard
                            key={notice.id_noticia}
                            news={notice}
                            titleSize="md"
                        />
                    ))
                )
            }
        </div>
        // noticias serão feitas em duas etapas, carrosel e cards soltos
    );
}