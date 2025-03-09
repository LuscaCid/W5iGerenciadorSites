import { Typography } from "@mui/material";
import { NewsCarousel } from "../components/NewsCaroussel"
import { NewsSection } from "../components/NewsSection";
import fakeNews from "../constants/news";
export const Home = () => {
  const carouselNews = fakeNews.slice(fakeNews.length / 2, fakeNews.length);
  const newsSectionNews = fakeNews.slice(0, (fakeNews.length / 2) -1);
  return (
    <div className="flex flex-col gap-5 pb-5">
      <NewsCarousel news={carouselNews}/>
      <Typography
        title=""
        
        // contentEditable
        fontSize={"32"}
      >
        Mais noticias
      </Typography>
      <NewsSection news={newsSectionNews} />
    </div>
  )
}