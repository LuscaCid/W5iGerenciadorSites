import { Noticia } from "../@types/News";
import { NewsCard } from "./NewsCard";

interface Props {
    news : Noticia[]
}
export const NewsSection = ({ news } : Props) => 
{
        return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-2/2">
            {
                news && news.length > 0 && (
                    news.map((notice) => (
                        <NewsCard
                            key={notice.id_noticia}
                            news={notice}
                            titleSize="lg"
                            titleOutside
                            textColor="black"
                        />
                    ))
                )
            }
        </div>
    );
}