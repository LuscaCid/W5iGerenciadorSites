import {NewsDetailInput} from "./NewsDetailInputs.tsx";
import {Tooltip} from "@mui/material";
import {Camera, Check} from "lucide-react";
import {ChangeEvent, FormEvent, useState} from "react";
import {Button} from "../UI/Button.tsx";
import {Noticia} from "../@types/News";

interface Props {
    news? : Noticia
}
export const NewsDetailAdmin = ({ news } : Props) => {

    const [ newsData, setNewsData ] = useState({
        image : news ? news.nm_img : "",
        title : news ? news.nm_titulo : "",
        paragraph : news ? news.ds_conteudo : "",
        subTitle : news ? news.ds_subtitulo : "",
    });

    const handleSubmit = (e : FormEvent) => {
        e.preventDefault();

        //TODO : atualizar a noticia no estado para que ao voltar, ela esteja de acordo com o que fora feito
        console.log('submit', e.isTrusted);

        // TODO : enviar requisicao para gravação da notícia no banco de dados

        // todo : ao salvar, deve-se verificar se a noticia fora passada,
        //  logo, possuindo um id indicando ser uma edicao
    }

    const handleChangeImage = (e : ChangeEvent<HTMLInputElement>) => {
        const file = e.target!.files![0];
        const imageObject = URL.createObjectURL(file);
        setNewsData({ ...newsData, image : imageObject });
    }
    return (
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
                <img
                    src={newsData.image}
                    className="w-full rounded-2xl shadow-lg"
                />

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

            <Button
                type="submit"
                form="noticia_form"
                title="Salvar"
                onClick={() => console.log("Salvar alterações")}
                className="flex-row-reverse w-fit bg-green-500 text-zinc-100 hover:bg-green-600"
                icon={Check}
            />
        </form>
    );
}