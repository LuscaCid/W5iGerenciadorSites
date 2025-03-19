import { NewsCard } from "../components/NewsCard";
import {useCallback, useEffect, useState} from "react";
import {Button} from "../UI/Button";
import {ArrowLeft, ArrowRight, EllipsisVertical, Plus, X} from "lucide-react";
import { useUserContext } from "../store/user";
import { Tag as TagComponent } from "../components/Tag";
import {useNavigate} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {NewsCardSkeleton} from "../components/NewsCardSkeleton.tsx";
import {useNews} from "../hooks/useNews.ts";
import {getTagsActions} from "../@shared/TagsActions.ts";
import {useNewsTagsContext} from "../store/newsTags.ts";
import {useTags} from "../hooks/useTags.ts";
import {Input} from "../UI/Input.tsx";

type PaginationDirection = "backwards" | "forwards";

export const News = () => {
  const { setSelectedTags, selectedTags } = useNewsTagsContext();
  const [ page, setPage ] = useState<number>(1);
  const [ tagsVisible, setTagsVisible ] = useState(false);
  const queryClient = useQueryClient();
  const [ debounce, setDebounce ] = useState(false);
  const [ query, setQuery ] = useState("");
  const { handleSelectTag } = getTagsActions({ setSelectedTags, selectedTags });
  const { getNews } = useNews();
  const { getTags } = useTags();

  const user = useUserContext((state) => state.user);
  const navigate = useNavigate();

  const { data : tags }=  useQuery({
    queryFn : async () => await getTags(query),
    queryKey : ["tags"]
  })
  const { data, isLoading } = useQuery({
    queryFn : async () => {
      try {
        return await getNews({
          page,
          nm_titulo : '',
          tags : selectedTags.map((tag) => tag.id_tag).join(","),
        })
      } catch(e){
        console.log(e);
      }
    },
    queryKey: ["news"],
    refetchOnWindowFocus : false,
  })

  const paginateBackwardsForwards = useCallback((dir : PaginationDirection ) => {
    setPage(dir == "backwards" ? (page => page - 1) : (page => page + 1));
  }, []);

  const toggleTagsVisibility = useCallback(() => {
    setTagsVisible(!tagsVisible);
  }, [tagsVisible]);

  useEffect(() => {
    queryClient.invalidateQueries({queryKey : ["news"]});
  }, [selectedTags, queryClient, page]);

  useEffect(() => {
    if (query)
    {
      setDebounce(true);
      const timeout = setTimeout(() => setDebounce(false), 500);
      return () => clearTimeout(timeout);
    }
    queryClient.invalidateQueries({queryKey : ["tags"]});
    setDebounce(false);
  }, [query, queryClient]);

  useEffect(() => {
    if (!debounce)
    {
      queryClient.invalidateQueries({queryKey : ["tags"]});
    }
  }, [ debounce, queryClient ]);
  return (
    <section className="flex  flex-col-reverse md:flex-row  gap-5 items-start relative mb-10 ">
      <main className="md:border-r w-full md:w-3/4 flex flex-col border-zinc-200/80  md:pr-6 relative">
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
        <section className="w-full gap-5  grid-stre grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mb-5 ">
          {
            !isLoading && data && data.news.length > 0 ? (
              data.news.map((news) => (
                <NewsCard
                  key={news.id_noticia}
                  textColor="black"
                  news={news}
                  titleOutside
                />
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
            onClick={() => paginateBackwardsForwards('backwards')}
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
        <header className="flex w-full justify-between flex-col  lg:items-start">
          <h2
            className="border-b text-2xl font-bold border-zinc-200/80 w-fit text-nowrap pb-1"
          >
            Tags mais relevantes 
          </h2>
          <fieldset className={"flex gap-2 items-center w-full"}>
            <Input
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                id={"search"}
                className={"w-full"}
                placeholder={"Pesquisar por tags"}
            />
            <Button
                onClick={() => setSelectedTags([])}
                description={"Limpar filtros"}
                icon={X}
                className={" p-[11px] text-sm"}
            />
          </fieldset>

          <Button 
            icon={EllipsisVertical}
            onClick={toggleTagsVisibility}
            iconSize={15}
            className="md:hidden rounded-full p-2 items-center justify-center shadow-lg h-10 w-10"
          />
        </header>

        <nav className={`${tagsVisible ? "flex  md:hidden" : "hidden"} w-full  md:flex flex-wrap gap-4  max-h-[700px] pb-4 overflow-y-auto no-scrollbar hover:scrollbar-view`}>
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
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/noticia")}
      className="w-full bg-zinc-200 h-[380px] max-h-[380px]  hover:border-[3px] border-dashed border-zinc-400 rounded-2xl cursor-pointer hover:bg-zinc-300 transition duration-150 flex items-center justify-center"
    >
      <main className="flex flex-col gap-2 items-center">
        <Plus size={55} className="text-zinc-400 "/>
        <span className="text-zinc-400 text-lg">
          Adicionar nova notícia
        </span>
      </main>
    </div>
  );
}