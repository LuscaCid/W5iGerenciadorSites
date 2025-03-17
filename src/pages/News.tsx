import { Typography } from "@mui/material"
// import fakenews from "../constants/news";
import { NewsCard } from "../components/NewsCard";
import { tags } from "../constants/tags";
import {useCallback, useEffect, useState} from "react";
import { Button } from "../UI/Button";
import { ArrowLeft, ArrowRight, EllipsisVertical, Plus } from "lucide-react";
import { useUserContext } from "../store/user";
import { Tag as TagComponent } from "../components/Tag";
import {useNavigate} from "react-router-dom";
import { Tag } from "../@types/Tag";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSiteContext} from "../store/site.ts";
import {NewsCardSkeleton} from "../components/NewsCardSkeleton.tsx";
import {useNews} from "../hooks/useNews.ts";
import {useNewsContext} from "../store/news.ts";

type PaginationDirection = "backwards" | "forwards";

export const News = () => {
  const [ selectedTags, setSelectedTags ] = useState<Array<Tag>>([]);
  const [ page, setPage ] = useState<number>(1);
  const [ tagsVisible, setTagsVisible ] = useState(false);
  const queryClient = useQueryClient();

  const { getNews } = useNews();

  const setNews = useNewsContext(state => state.setNews)
  const site = useSiteContext(state => state.site);
  const user = useUserContext((state) => state.user);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryFn : async () => {
      try {
        const res = await getNews({
          page,
          nm_titulo : '',
          id_site : site!.id_site!,
          tags : selectedTags,
        })
        setNews(res.news);
        return res;
      } catch(e){
        console.log(e);
      }
    },
    queryKey: [ "news", page, tags ],
    refetchOnWindowFocus : false,
  })

  const handleSelectTag = useCallback((selectedTag : Tag) => {
    const tagAlreadySelected = selectedTags.find((tag) => tag.id_tag == selectedTag.id_tag);
    if (tagAlreadySelected) 
    {
      setSelectedTags(
        selectedTags.filter((tag) => tag.id_tag!== selectedTag.id_tag)
      );
      return;
    }
    setSelectedTags([...selectedTags, selectedTag ])
  }, [ selectedTags ]);

  const paginateBackwardsForwards = useCallback((dir : PaginationDirection ) => {
    setPage(dir == "backwards" ? (page => page - 1) : (page => page + 1));
  }, []);

  const toggleTagsVisibility = useCallback(() => {
    setTagsVisible(!tagsVisible);
  }, [tagsVisible]);

  useEffect(() => {
    if (page)
    {
      queryClient.invalidateQueries({queryKey : ["news"]})
    }
  }, [page]);
  return (
    <section className="flex  flex-col-reverse md:flex-row  gap-12 items-start relative mb-10 ">
      <main className="md:border-r w-full md:w-3/4 flex flex-col border-zinc-200/80 p-1 md:pr-6 relative">
        <div className="flex items-center gap-2 justify-center absolute -top-12 right-4 z-[30]">
          <span className="rounded-full flex items-center justify-center   h-10 text-nowrap px-3 bg-zinc-100  shadow-lg  text-sm select-none">
            Pág {page}
          </span>
          {
            user && (
              <Button
                className=" shadow-lg h-10 w-10 p-2 items-center justify-center bg-green-500 hover:bg-green-600 rounded-full"
                icon={Plus}
                onClick={() => navigate("/noticia")}
              />
            )
          }
        </div>
        <section className="w-full gap-5  grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mb-5 ">
          {
            !isLoading && data && data.news.length > 0 ? (
              data.news.map((news) => (
                <NewsCard key={news.id_noticia} textColor="black" news={news}  titleOutside/>
              ))
            ) : isLoading && (
              Array.from({length : 10}).map((_, idx) => (
                  <NewsCardSkeleton key={idx} />
              ))
            )
          }
          {
            user && (
              <NewNoticeCard />
            ) 
          }
        </section>
         <footer className="w-full flex justify-between items-center">
          <Button 
            onClick={() => paginateBackwardsForwards('forwards')}
            icon={ArrowLeft}
            title="Anterior"
            disabled={page == 1}
          />
          <Button 
            onClick={() => paginateBackwardsForwards('forwards')}
            icon={ArrowRight}
            title="Próxima"
            className="flex-row-reverse"
          />
        </footer>
      </main>
      {/* tags */}
      <aside className="flex flex-wrap  p-2 rounded-lg  gap-5 w-full md:w-1/4 md:sticky top-24 z-40">
        <header className="flex justify-between items-center w-full">
          <Typography
            variant="h5"
            className="border-b border-zinc-200/80 w-fit text-nowrap pb-1"
          >
            Tags mais relevantes 
          </Typography>
          <Button 
            icon={EllipsisVertical}
            onClick={toggleTagsVisibility}
            iconSize={15}
            className="md:hidden rounded-full p-2 items-center justify-center shadow-lg h-10 w-10"
          />
        </header>
     
        <nav className={`${tagsVisible ? "flex  md:hidden" : "hidden"}  md:flex flex-wrap gap-4 w-full max-h-[700px] pb-4 overflow-y-auto no-scrollbar hover:scrollbar-view`}>
        {
         tags && tags.length > 0 &&  (
            tags.map((tag) => (
              <TagComponent
                key={tag.id_tag}
                selectedTags={selectedTags}
                tag={tag}
                handleSelectTag={handleSelectTag}
              />
            ))
          )
        }
        </nav>
      </aside>
    </section>
  )
}


const NewNoticeCard = () => {
  return (
    <div className="w-full bg-zinc-200 h-[380px] max-h-[380px]  hover:border-[3px] border-dashed border-zinc-400 rounded-2xl cursor-pointer hover:bg-zinc-300 transition duration-150 flex items-center justify-center">
      <main className="flex flex-col gap-2 items-center">
        <Plus size={55} className="text-zinc-400 "/>
        <span className="text-zinc-400 text-lg">
          Adicionar nova notícia
        </span>
      </main>
    </div>
  );
}