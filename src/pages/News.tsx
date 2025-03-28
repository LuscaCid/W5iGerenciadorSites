import { NewsCard } from "../components/NewsCard";
import {useCallback, useEffect, useState} from "react";
import {Button} from "../UI/Button";
import {ArrowLeft, ArrowRight, EllipsisVertical, Plus, X, FilterX} from "lucide-react";
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
import {Skeleton} from "@mui/material";

type PaginationDirection = "backwards" | "forwards";

export const News = () => {
  const { setSelectedTags, selectedTags, title, setTitle } = useNewsTagsContext();
  const user = useUserContext((state) => state.user);
  const [ page, setPage ] = useState<number>(1);
  const [ tagsVisible, setTagsVisible ] = useState(false);
  const queryClient = useQueryClient();
  const [ debounce, setDebounce ] = useState(false);
  const [ query, setQuery ] = useState("");
  const { handleSelectTag } = getTagsActions({ setSelectedTags, selectedTags });

  const { getNews } = useNews();
  const { getTags } = useTags();

  const navigate = useNavigate();

  const { data : tags, isPending : isPendingTags }=  useQuery({
    queryFn : async () => await getTags(query),
    queryKey : ["tags"]
  })
  const { data, isPending } = useQuery({
    queryFn : async () => {
      try {
        return await getNews({
          page,
          nm_titulo : title,
          tags : selectedTags.map((tag) => tag.id_tag).join(","),
        })
      } catch(e){
        console.log(e);
      }
    },
    queryKey: ["news"],
    refetchOnWindowFocus : false,
  })
  const handleClearFilters = useCallback(() => {
    setTitle("");
    setSelectedTags([]);
  },[setSelectedTags, setTitle]);

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
      <main className="md:border-r w-full md:w-3/4 flex flex-col border-zinc-200/80 dark:border-zinc-700 md:pr-6 relative">
        <div className="flex items-center gap-2 justify-center absolute -top-12 right-4 z-[30]">
          <span className="rounded-full flex items-center justify-center   h-10 text-nowrap px-3 bg-zinc-100 dark:bg-zinc-600  shadow-lg  text-sm select-none">
            Pág {page}
          </span>
          {
            user && (
              <Button
                className=" shadow-lg h-10 w-10 p-2 text-zinc-100 items-center justify-center bg-green-600 hover:bg-green-700 rounded-full"
                icon={Plus}
                onClick={() => navigate("/noticia")}
              />
            )
          }
          <Button
            className=" shadow-lg h-10 w-10 p-2 text-zinc-100 items-center justify-center bg-red-400 hover:bg-red-500 rounded-full"
            icon={FilterX}
            onClick={handleClearFilters}
            description={"Limpar todos os filtros"}
          />
        </div>
        <section className="w-full gap-5  grid-stre grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mb-5 ">
          {
            !isPending && data && data.length > 0 ? (
              data.map((news) => (
                <NewsCard
                  key={news.id_noticia}
                  textColor="black"
                  news={news}
                  titleOutside
                />
              ))
            ) : isPending && (
              Array.from({length : 10}).map((_, idx) => (
                  <NewsCardSkeleton  key={idx} />
              ))
            )
          }
          {
            !isPending && data && data.length == 0 && (
                <span className={"text-zinc-400 lg:text-2xl text-nowrap"}>
                  Nenhum resultado encontrado.
                </span>
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
      <aside className="flex flex-wrap  p-2 rounded-lg mb-10 lg:mb-0 gap-5 w-full md:w-1/4 lg:sticky lg:top-24 lg:z-40">
        <header className="flex w-full justify-between flex-col  lg:items-start">
          <h2
            className="border-b text-2xl font-bold border-zinc-200/80 w-fit text-nowrap pb-1"
          >
            Tags mais relevantes 
          </h2>
          <div className={"flex gap-2 items-center h-fit w-full"}>
            <header className={"flex items-center gap-2 w-full"}>
              <Button
                icon={EllipsisVertical}
                onClick={toggleTagsVisibility}
                iconSize={15}
                className="md:hidden rounded-full p-0 items-center justify-center shadow-lg h-10 w-10"
              />
            <Input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              id={"search"}
              className={"w-full"}
              placeholder={"Pesquisar por tags"}
            />
            </header>
            <Button
              onClick={() => {
                setSelectedTags([]);
                setQuery("");
              }}
              description={"Limpar tags"}
              icon={X}
              className={"text-sm p-auto  bg-red-400 p-1 text-zinc-100  hover:bg-red-500"}
            />
          </div>


        </header>

        <nav className={`${tagsVisible ? "flex  md:hidden" : "hidden"} w-full  md:flex flex-wrap gap-4  max-h-[400px]  lg:max-h-[700px] pb-4  overflow-y-auto no-scrollbar hover:scrollbar-view`}>
          {
            !isPendingTags && tags && tags.length > 0 &&  (
              tags.map((tag) => (
                <TagComponent
                  key={tag.id_tag + tag.nm_slug}
                  selectedTags={selectedTags}
                  tag={tag}
                  handleSelectTag={handleSelectTag}
                />
              ))
            )
          }
          {
            isPendingTags && (
              Array.from({length : 10}).map((_, idx) => (
                <Skeleton
                  key={idx}
                  variant={"rectangular"}
                  width={Math.round(Math.random() * 100) + 70}
                  height={30}
                  animation={"wave"}
                  className={"rounded-full h-[20px] shadow-2xl"}
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
      className="w-full bg-zinc-200 dark:bg-zinc-800 h-[380px] max-h-[380px]  hover:border-[3px] border-dashed border-zinc-400 dark:border-zinc-700  rounded-2xl cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900 transition duration-150 flex items-center justify-center"
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