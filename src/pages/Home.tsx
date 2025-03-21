import { NewsCarousel } from "../components/NewsCaroussel"
import { NewsSection } from "../components/NewsSection";
import {useQuery} from "@tanstack/react-query";
import {useNews} from "../hooks/useNews.ts";
import {HomeSkeleton} from "../components/HomeSkeleton.tsx";

export const Home = () => {
  const { getNews } = useNews();
  const {data, isLoading} = useQuery({
      queryFn : async () => await getNews({ page : 1, nm_titulo : "", tags :""  }),
      queryKey : ["news"]
  })

  return (
    <div className="flex flex-col gap-5 pb-5">
        {
            isLoading && (
                <HomeSkeleton />
            )
        }
        {!isLoading && data && data.length > 0 && (
            <>
                <NewsCarousel news={data}/>
                <h1
                    className={"text-lg font-semibold "}
                >
                    Mais noticias
                </h1>
                <NewsSection news={data} />
            </>
        )}

    </div>
  )
}