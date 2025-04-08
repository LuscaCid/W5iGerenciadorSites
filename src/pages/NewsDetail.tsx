import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../UI/Button";
import { ArrowLeft, } from "lucide-react";
import { formatDate, formatDistanceToNow } from 'date-fns';
import { ptBR } from "date-fns/locale"
import { useUserContext } from "../store/user";
import { NewsDetailAdmin } from "../components/NewsDetailAdmin.tsx";
import {NewsDetailClient} from "../components/NewsDetailClient.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {Noticia} from "../@types/News";
import {memo, useEffect, useState} from "react";
import {UserAvatar} from "../components/UserAvatar.tsx";
import {Tooltip} from "@mui/material";

export const NewsDetail = memo(() => {

  const params = useParams();
  const navigate = useNavigate();
  const user = useUserContext((state) => state.user)
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData(['news']) as Noticia[];
  const newsFoundById = params.id && data ? data.find((news) => news.id_noticia! == Number(params.id!)) : undefined;
  const [ actualNewsSelected, setActualNewsSelected ] = useState<Noticia|undefined>(newsFoundById);

  useEffect(() => {
    if (newsFoundById)
    {
      setActualNewsSelected(newsFoundById);
      return;
    }
    queryClient.invalidateQueries({queryKey : ["news"]});

  }, [ actualNewsSelected, queryClient, params.id ]);
  return (
    <div className="flex flex-col gap-4 items-center  md:px-36 2xl:px-60 ">
      <main className="flex flex-col gap-3 w-full h-full mb-10">
        {
          user ? (
             <NewsDetailAdmin setNews={setActualNewsSelected} news={actualNewsSelected} />
          ) : (
            <NewsDetailClient setNews={setActualNewsSelected} news={actualNewsSelected!}/>
          )
        }
        <footer className="flex flex-col gap-3">
          {/* autor */}
          {
            actualNewsSelected && (
              <>
                <UserAvatar
                    subtitle={"Publicado em "+ formatDate(actualNewsSelected.dt_publicacao!, "dd/MM/yyyy 'às' HH'h'mm")}
                    clickable={false}
                    title={`Por: ${actualNewsSelected.usuario?.nm_user}`}
                />
                {/* data de publicacao da noticia no portal */}
                <div className="self-end text-zinc-600 text-sm flex gap-2 items-center">
                  <Tooltip
                    title={actualNewsSelected!.dt_publicacao}
                    enterDelay={200}
                    enterNextDelay={300}
                  >
                    <span>
                      Atualizado { formatDistanceToNow(actualNewsSelected!.dt_publicacao!, { addSuffix : true, locale : ptBR } )}
                    </span>
                  </Tooltip>
                </div>
              </>
              )
          }

          <section className="flex items-center w-full justify-between">
            <Button 
              title="Voltar"
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              className="w-fit"
            />
          </section>
        </footer>
      </main>
    </div>
  )
})

 