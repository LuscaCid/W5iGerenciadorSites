import { NewsCarousel } from "../components/NewsCaroussel"
import fakeNews from "../constants/news";
export const Home = () => {
  return (
    <div>
      <NewsCarousel news={fakeNews}/>
      
    </div>
  )
}