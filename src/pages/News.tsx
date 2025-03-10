import { Tooltip, Typography } from "@mui/material"
import fakenews from "../constants/news";
import { NewsCard } from "../components/NewsCard";
import { tags } from "../constants/tags";
import { useCallback, useEffect, useState } from "react";
import { Tag } from "../@types/News";
import { Button } from "../UI/Button";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

type PaginationDirection = "backwards" | "fowards";
export const News = () => {
  const [ selectedTags, setSelectedTags ] = useState<Array<Tag>>([]);
  const [ page, setPage ] = useState<number>(1);
  
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

  const paginateBackwardsFowards = useCallback((dir : "backwards" | "fowards") => {
    setPage(dir == "backwards" ? (page -1) : (page + 1));
  }, []);

  useEffect(() => {

  }, [ page ]);
  //uma consulta sera feita inicialmente sem filtros, mas ao clicar em tags, aparecerao apenas 
  // noticias com aquelas tags que estão selecionadas
  return (
    <section className="flex  flex-col-reverse md:flex-row  gap-4 items-start relative mb-10">
      <main className="md:border-r w-full flex flex-col border-zinc-200/80 p-1 md:pr-6">
        <section className="w-full gap-5  grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mb-5 ">
          {
            fakenews && fakenews.length > 0 && (
              fakenews.map((news) => (
                <NewsCard key={news.id_noticia} textColor="black" news={news}  titleOutside/>
              ))
            )
          }
        </section>
         <footer className="w-full flex justify-between">
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
      <aside className="flex flex-wrap  p-2 rounded-lg  gap-3 w-full md:w-1/4 md:sticky top-28 z-40">
        <Typography
          variant="h5"
          className="border-b border-zinc-200/80 w-fit text-nowrap pb-1"
        >
          Tags mais relevantes 
        </Typography>
        <nav className="flex flex-wrap gap-4 w-full">
          {
            tags && tags.length > 0 &&  (
              tags.map((tag) => (
                <Tooltip
                  key={tag.id_tag}
                  enterDelay={400}
                  enterNextDelay={400}
                  title="Marcar para filtrar resultados"
                >
                  <span 
                    onClick={() => handleSelectTag(tag)}
                    className={`w-fit select-none transition shadow-lg duration-200 rounded-full py-1 px-3  text-nowrap overflow-ellipsis overflow-hidden  cursor-pointer ${selectedTags.find((selectedTag) => selectedTag.id_tag === tag.id_tag) ? "bg-blue-500 text-zinc-50 hover:bg-blue-600" : "bg-zinc-100 hover:bg-zinc-300"} transition duration-150`}
                  >
                    {tag.nm_slug}
                  </span>
                </Tooltip>
              ))
            )
          }
        </nav>
      </aside>
    </section>
  )
}