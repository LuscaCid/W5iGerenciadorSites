import { useNavigate, useParams } from "react-router-dom"
import fakeNews from "../constants/news";
import { Typography } from "@mui/material";
import { Button } from "../UI/Button";
import { ArrowLeft } from "lucide-react";

export const NewsDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const noticeFoundById = fakeNews.find((notice) => notice.id_noticia! == Number(params!.id!));
  console.log(noticeFoundById);
  const image = noticeFoundById?.nm_img ? noticeFoundById?.nm_img : "";
  return (
    <div className="flex flex-col gap-4 items-center md:px-36 2xl:px-72 ">
      <main className="flex flex-col gap-2  w-full mb-10">
        <img src={image} className="w-full"/>
        <Typography 
          fontWeight={"700"}
          variant="h4"
        >
          {noticeFoundById?.nm_titulo}
        </Typography>
        <div className="h-[1px] w-full bg-zinc-300/60 mb-5"/>
        <Typography
          variant="h5"
        >
          {noticeFoundById?.ds_subtitulo}
        </Typography>
        <p>
          {
            noticeFoundById?.ds_conteudo
          }
        </p>
        <footer className="flex flex-col gap-3">
          {/* autor */}
          <span></span>
          {/* data de publicacao da noticia no portal */}
          <Button 
            title="Voltar"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-fit"
          />
        </footer>
      </main>
    </div>
  )
}

 