import { useNavigate, useParams } from "react-router-dom"
import fakeNews from "../constants/news";
import { Tooltip, Typography } from "@mui/material";
import { Button } from "../UI/Button";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { formatDate, formatDistanceToNow } from 'date-fns';
import { ptBR } from "date-fns/locale"
import { useUserContext } from "../store/user";
import { ChangeEvent, FormEvent, useState } from "react";
import { NewsDetailInput } from "../components/NewsDetailInputs";
import { useNews } from "../hooks/useNews";
export const NewsDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const user = useUserContext((state) => state.user)
  const noticeFoundById = fakeNews.find((notice) => notice.id_noticia! == Number(params!.id!));
  const { postNews } = useNews();
  // objeto para gravação das informacoes correlatas ao formulário  
  const [ newsData, setNewsData ] = useState({
    image : noticeFoundById!.nm_img ?? "",
    title : noticeFoundById!.nm_titulo ?? "",
    paragraph : noticeFoundById!.ds_conteudo ?? "",
    subTitle : noticeFoundById!.ds_subtitulo ?? "",
  });

  const handleChangeImage = (e : ChangeEvent<HTMLInputElement>) => {
    const file = e.target!.files![0];
    const imageObject = URL.createObjectURL(file); 
    setNewsData({ ...newsData, image : imageObject });
  }
  const handleSubmit = (e : FormEvent) => {
    e.preventDefault();

    //TODO : atualizar a noticia no estado para que ao voltar, ela esteja de acordo com o que fora feito
    console.log('submit', e.isTrusted);
    
    // TODO : enviar requisicao para gravação da notícia no banco de dados
  }
  return (
    <div className="flex flex-col gap-4 items-center  md:px-36 2xl:px-72 ">
      <main className="flex flex-col gap-3 w-full h-full mb-10">
        {
          !user ? (
            <>
              <h1 className="font-[700] text-4xl text-zinc-800">
                {noticeFoundById?.nm_titulo}
              </h1>
              <h3 className="text-2xl font-[600] text-zinc-600">
                {noticeFoundById?.ds_subtitulo}
              </h3>
              <p className="text-md text-zinc-500">
                {
                  noticeFoundById?.ds_conteudo
                }
              </p>
              <img src={newsData.image} className="w-full rounded-2xl shadow-lg"/>
            </>
          ) : (
            <form
              onSubmit={handleSubmit} 
              id="noticia_form"
              name="noticia_form"
              className="flex flex-col gap-3"
            >
              <NewsDetailInput
                onChangeFn={(e) => setNewsData({ ...newsData, title : e.target.value})}
                value={newsData.title}
                placeholder="Editar o título"
                variant="title"
                maxLength={200}
              />
              <NewsDetailInput
                onChangeFn={(e) => setNewsData({ ...newsData, subTitle : e.target.value})}
                value={newsData.subTitle}
                placeholder="Editar o subtítulo"
                variant="subtitle"
                maxLength={500}
              />
              <NewsDetailInput
                onChangeFn={(e) => setNewsData({ ...newsData, paragraph : e.target.value })}
                value={newsData.paragraph}
                placeholder="Editar o paragrafo"
                variant="paragraph"
                maxLength={2000}
              />
              <section className="relative">
                <img src={newsData.image} className="w-full rounded-2xl shadow-lg"/>
                <Tooltip
                  enterDelay={500}
                  enterNextDelay={400}
                  title="Alterar imagem da notícia"
                >
                  <label 
                    className="rounded-lg p-3  hover:bg-zinc-300 backdrop:blur-3xl cursor-pointer transition duration-150 bg-zinc-200 absolute -bottom-4 -right-4"
                    htmlFor="noticia_img"
                  >
                    <Camera size={20}/>
                  </label>
                </Tooltip>
                <input 
                  onChange={handleChangeImage}
                  className="sr-only"
                  id="noticia_img"
                  type="file" 
                />
              </section>
            </form>
          ) 
        }
        <footer className="flex flex-col gap-3">
          {/* autor */}
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
          <section className="flex items-center w-full justify-between">
            <Button 
              title="Voltar"
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              className="w-fit"
            />
            {
              user && (
                <Button
                  type="submit"
                  form="noticia_form"
                  title="Salvar"
                  onClick={() => console.log("Salvar alterações")}
                  className="flex-row-reverse w-fit bg-green-500 text-zinc-100 hover:bg-green-600"
                  icon={Check}
                />
              )
            }
          </section>
        </footer>
      </main>
    </div>
  )
}

 