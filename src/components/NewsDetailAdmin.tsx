import {NewsDetailInput} from "./NewsDetailInputs.tsx";
import {Tooltip} from "@mui/material";
import {Camera, Check, Pencil, Plus} from "lucide-react";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Button} from "../UI/Button.tsx";
import {Noticia} from "../@types/News";
import DefaultImage from "/default-news-img.avif";

type ImageSlot = {
    url : string;
    fileName : string;
    id : number;
    file : File
};

interface Props {
    news? : Noticia
}
export const NewsDetailAdmin = ({ news } : Props) => {

    const [ newsData, setNewsData ] = useState({
        thumbImage : news ? news.url_thumbimg : DefaultImage,
        images : news ? news.images : undefined,
        title : news ? news.nm_titulo : "",
        paragraph : news ? news.ds_conteudo : "",
        subTitle : news ? news.ds_subtitulo : "",
    });

    const [ imageSlots, setImageSlots ] = useState<ImageSlot[]>([]);
    const handleSubmit = (e : FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        imageSlots.forEach((slot) => {
            formData.append('images', slot.file)
        })

        //TODO : atualizar a noticia no estado para que ao voltar, ela esteja de acordo com o que fora feito
        console.log('submit', e.isTrusted);

        // TODO : enviar requisicao para gravação da notícia no banco de dados

        // todo : ao salvar, deve-se verificar se a noticia fora passada,
        //  logo, possuindo um id indicando ser uma edicao
    }

    const handleChangeSlotImage = (e : ChangeEvent<HTMLInputElement>, id : number) => {
        if (e.target.files)
        {
            const file = e.target.files![0];

            const imageObject = URL.createObjectURL(file);
            setImageSlots(
                imageSlots.map((slot) =>{
                    if(slot.id == id)
                    {
                        return {
                            url : imageObject,
                            fileName : file.name,
                            file,
                            id : id
                        }
                    }
                    return slot;
                })
            )
        }
    }
    const handleChangeImage = (e : ChangeEvent<HTMLInputElement>) => {
        const file = e.target!.files![0];
        const imageObject = URL.createObjectURL(file);
        setNewsData({ ...newsData, thumbImage  : imageObject });
    }
    const handleAddNewSlot = () => {
        setImageSlots([...imageSlots, { id : imageSlots.length + 1 } as ImageSlot])
    }
    useEffect(() => {
        if (news && news.images && news.images.length > 0)
        {
            const slotsFromNewsImages = news.images.map((img, idx) => (
                {
                    url : img.url,
                    fileName : img.fileName,
                    id : idx,
                    file : { name : img.fileName, type : img.contentType, size : img.fileSize } as File
                } as ImageSlot
            ))
            setImageSlots(slotsFromNewsImages);
        }
    }, [news]);
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
                placeholder={`${news ? "Editar o título" : "Adicione um título"}`}
                variant="title"
                maxLength={200}
            />
            <NewsDetailInput
                onChangeFn={(e) => setNewsData({ ...newsData, subTitle : e.target.value})}
                value={newsData.subTitle}
                placeholder={`${news ? "Editar o subtítulo" : "Adicione um subtítulo"}`}
                variant="subtitle"
                maxLength={500}
            />
            <NewsDetailInput
                onChangeFn={(e) => setNewsData({ ...newsData, paragraph : e.target.value })}
                value={newsData.paragraph}
                placeholder={`${news ? "Editar o paragrafo" : "Adicione um paragrafo"}`}
                variant="paragraph"
                maxLength={2000}
            />
            <section className="relative">
                <img
                    alt={"Imagem de thumbnail da noticia"}
                    src={newsData.thumbImage}
                    className="w-full rounded-2xl shadow-lg "
                />

                <Tooltip
                    enterDelay={500}
                    enterNextDelay={400}
                    title="Alterar imagem de thumbnail da notícia"
                >
                    <label
                        className="rounded-lg p-3 hover:bg-zinc-300 backdrop:blur-3xl cursor-pointer transition duration-150 bg-zinc-200 absolute -bottom-4 -right-4"
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
            <footer className={"flex flex-col  gap-2"}>
                <Tooltip
                    title={"Clique para adicionar um novo espaço para imagem."}
                    enterDelay={400}
                    enterNextDelay={400}
                >
                    <Button
                        className={"w-fit"}
                        icon={Plus}
                        onClick={handleAddNewSlot}
                    />
                </Tooltip>
                <section className={" w-full grid md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 overscroll-x-auto"}>
                    {
                        imageSlots.length > 0 && (
                            imageSlots.map((slot, idx) => (
                                <div
                                    key={idx.toString()}
                                    className={"group overflow-hidden relative shadow-lg rounded-lg"}
                                >
                                    <img
                                        className={"w-full rounded-lg max-w-[500px] aspect-video"}
                                        alt={"imagem da noticia"}
                                        src={slot.url ? slot.url : DefaultImage}

                                    />
                                    <Tooltip
                                        enterDelay={300}
                                        enterNextDelay={300}
                                        title={"Editar imagem"}
                                    >

                                        <label
                                            className={"rounded-full absolute right-2 -top-10 group-hover:top-2 transition-all z-50  flex items-center justify-center h-10 w-10 bg-zinc-200 hover:bg-zinc-300  duration-150"}
                                            htmlFor={"image_slot" + idx.toString()}
                                        >
                                            <Pencil size={15} className={"text-zinc-500"}/>
                                        </label>

                                    </Tooltip>
                                    <input
                                        onChange={(e) => handleChangeSlotImage(e, slot.id)}
                                        className={"sr-only"}
                                        id={"image_slot" + idx.toString()}
                                        type={"file"}
                                    />
                                </div>

                            ))
                        )
                    }
                </section>
            </footer>
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