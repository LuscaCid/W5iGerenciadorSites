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

export const NewsDetail = () => {

  const params = useParams();
  const navigate = useNavigate();
  const user = useUserContext((state) => state.user)
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData(['news']) as { news : Noticia[] } ;
  const newsFoundById = params.id ? data.news.find((notice) => notice.id_noticia! == Number(params.id!)) : undefined;

  return (
    <div className="flex flex-col gap-4 items-center  md:px-36 2xl:px-60 ">
      <main className="flex flex-col gap-3 w-full h-full mb-10">
        {
          user ? (
             <NewsDetailAdmin news={newsFoundById} />
          ) : (
            <NewsDetailClient news={newsFoundById!}/>
          )
        }
        <footer className="flex flex-col gap-3">
          {/* autor */}
          {
            newsFoundById && (
              <>
                <span></span>
                {/* data de publicacao da noticia no portal */}
                <div className="self-end text-zinc-600 text-sm flex gap-2 items-center">
                  <span>
                    {formatDate(newsFoundById!.dt_publicacao!, "dd/MM/yyyy  HH'h'mm")}
                  </span>
                  <span>
                    Atualizado { formatDistanceToNow(newsFoundById!.dt_publicacao!, { addSuffix : true, locale : ptBR } )}
                  </span>
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
}

 