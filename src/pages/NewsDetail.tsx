import { useNavigate, useParams } from "react-router-dom"
import fakeNews from "../constants/news";
import { Button } from "../UI/Button";
import { ArrowLeft, } from "lucide-react";
import { formatDate, formatDistanceToNow } from 'date-fns';
import { ptBR } from "date-fns/locale"
import { useUserContext } from "../store/user";
import { NewsDetailAdmin } from "../components/NewsDetailAdmin.tsx";
import {NewsDetailClient} from "../components/NewsDetailClient.tsx";

export const NewsDetail = () => {

  const params = useParams();
  const navigate = useNavigate();
  const user = useUserContext((state) => state.user)

  const noticeFoundById = params.id ? fakeNews.find((notice) => notice.id_noticia! == Number(params.id!)) : undefined;

  return (
    <div className="flex flex-col gap-4 items-center  md:px-36 2xl:px-60 ">
      <main className="flex flex-col gap-3 w-full h-full mb-10">
        {
          user ? (
             <NewsDetailAdmin news={noticeFoundById} />
          ) : (
            <NewsDetailClient news={noticeFoundById!}/>
          )
        }
        <footer className="flex flex-col gap-3">
          {/* autor */}
          {
            noticeFoundById && (
              <>
                <span></span>
                {/* data de publicacao da noticia no portal */}
                <div className="self-end text-zinc-600 text-sm flex gap-2 items-center">
                  <span>
                    {formatDate(noticeFoundById!.dt_publicacao!, "dd/MM/yyyy  HH'h'mm")}
                  </span>
                  <span>
                    Atualizado { formatDistanceToNow(noticeFoundById!.dt_publicacao!, { addSuffix : true, locale : ptBR } )}
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

 