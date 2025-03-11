import { Tooltip, Typography } from "@mui/material"
import fakenews from "../constants/news";
import { NewsCard } from "../components/NewsCard";
import { tags } from "../constants/tags";
import { useCallback, useEffect, useState } from "react";
import { Tag } from "../@types/News";
import { Button } from "../UI/Button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useUserContext } from "../store/user";
import { Tag as TagComponent } from "../components/Tag";

type PaginationDirection = "backwards" | "fowards";
export const News = () => {
  const [ selectedTags, setSelectedTags ] = useState<Array<Tag>>([]);
  const [ page, setPage ] = useState<number>(1);
  const user = useUserContext((state) => state.user);

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

  const paginateBackwardsFowards = useCallback((dir : PaginationDirection ) => {
    setPage(dir == "backwards" ? (page => page - 1) : (page => page + 1));
  }, []);

  useEffect(() => {

  }, [ page ]);
  return (
    <section className="flex  flex-col-reverse md:flex-row  gap-4 items-start relative mb-10 ">
      <main className="md:border-r w-3/4 flex flex-col border-zinc-200/80 p-1 md:pr-6 relative">
        <span className="rounded-full flex items-center justify-center   h-10 text-nowrap px-3 bg-zinc-100 absolute -top-12 shadow-lg right-4 z-[30]">
          Pág {page}
        </span>
        <section className="w-full gap-5  grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mb-5 ">
          {
            fakenews && fakenews.length > 0 && (
              fakenews.map((news) => (
                <NewsCard key={news.id_noticia} textColor="black" news={news}  titleOutside/>
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
            onClick={() => paginateBackwardsFowards('backwards')}
            icon={ArrowLeft}
            title="Anterior"
            disabled={page == 1}
          />
          <Button 
            onClick={() => paginateBackwardsFowards('fowards')}
            icon={ArrowRight}
            title="Próxima"
            className="flex-row-reverse"
          />
        </footer>
      </main>
      {/* tags */}
      <aside className="flex flex-wrap  p-2 rounded-lg  gap-3 w-full md:w-1/4 md:sticky top-24 z-40">
        <Typography
          variant="h5"
          className="border-b border-zinc-200/80 w-fit text-nowrap pb-1"
        >
          Tags mais relevantes 
        </Typography>
        <nav className="flex flex-wrap gap-4 w-full max-h-[700px] pb-4 overflow-auto">
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
    <div className="w-full bg-zinc-200 h-full hover:border-[3px] border-dashed border-zinc-400 rounded-2xl cursor-pointer hover:bg-zinc-300 transition duration-150 flex items-center justify-center">
      <main className="flex flex-col gap-2 items-center">
        <Plus size={55} className="text-zinc-400 "/>
        <span className="text-zinc-400 text-lg">
          Adicionar nova notícia
        </span>
      </main>
    </div>
  );
}