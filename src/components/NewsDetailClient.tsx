import {Noticia} from "../@types/News";

interface  Props {
    news : Noticia
}
export const NewsDetailClient = ({ news } : Props) => {

    return (
        <>
            <h1 className="font-[700] text-4xl text-zinc-800">
                {news?.nm_titulo}
            </h1>
            <h3 className="text-2xl font-[600] text-zinc-600">
                {news?.ds_subtitulo}
            </h3>
            <p className="text-md text-zinc-500">
                {
                    news?.ds_conteudo
                }
            </p>
            <img
                alt={"imagem da noticia"}
                src={news.nm_img}
                className="w-full rounded-2xl shadow-lg"
            />
        </>
    )
}