import {NewsDetailInput} from "./NewsDetailInputs.tsx";
import {Tooltip} from "@mui/material";
import {Camera, Check, Plus, Search, X} from "lucide-react";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState} from "react";
import {Button} from "../UI/Button.tsx";
import {Noticia} from "../@types/News";
import {useUserContext} from "../store/user.ts";
import {useSiteContext} from "../store/site.ts";
import {useNews} from "../hooks/useNews.ts";
import {useMutation} from "@tanstack/react-query";
import {ImageSlotFc} from "./ImageSlot.tsx";
import * as Dialog from "@radix-ui/react-dialog";
import {TagSearchDialog} from "./Dialogs/TagSearch.tsx";
import {Tag} from "../@types/Tag";
import { getTagsActions } from '../@shared/TagsActions.ts';
import {useContextSelector} from "use-context-selector";
import {toastContext} from "./Toast.tsx";
import DefaultImage from "/default-featured-image.jpg";
import {AxiosError} from "axios";
import {useParams} from "react-router-dom";
import {Paragraph} from "../@types/Paragraph";

export type ImageSlot = {
    fileName : string;
    id : number|string;
    file : File
    url? : string;
};

interface Props {
    news? : Noticia
    setNews : Dispatch<SetStateAction<Noticia|undefined>>
}

export const NewsDetailAdmin = ({ news, setNews } : Props) => {

    const { getNewsById } = useNews();
    const user = useUserContext(state => state.user);
    const site = useSiteContext(state => state.site);
    const openToast = useContextSelector(toastContext, (context) => context.open);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [ selectedTags, setSelectedTags ] = useState<Tag[]>(news ? news.tags ?? [] : []);
    const [ imageSlots, setImageSlots ] = useState<ImageSlot[]>([]);

    const [ paragraphSlots, setParagraphsSlots ] = useState<Paragraph[]>(news ? news.paragraphs ?? [] : []);
    const [ thumbnailSlot, setThumbnailSlot ] = useState<ImageSlot>({
        url : news ? news?.url_thumbimg : DefaultImage,
    } as ImageSlot);

    const params = useParams();
    const [ newsData, setNewsData ] = useState<Noticia>({
        url_thumbimg : news ? news.url_thumbimg : DefaultImage,
        images : news ? news.images : [],
        nm_titulo : news ? news.nm_titulo : "",
        ds_subtitulo : news ? news.ds_subtitulo : "",
        ds_conteudo : news ? news.ds_conteudo : "",
        id_noticia : 1,
        tags : [],
        paragraphs : news ? news?.paragraphs : []
    });
    const { handleSelectTag } = getTagsActions({ selectedTags, setSelectedTags });

    const { postNews } = useNews();

    const { mutateAsync : postNewsAsync, isPending } = useMutation({
        mutationFn : postNews,
        onSuccess : () => openToast("Notícia salva com sucesso", "success"),
        onError : (err : unknown) => err instanceof AxiosError && openToast(err.response!.data.message, "error"),
        retry : 2
    })

    const handleSubmit = useCallback(async(e : FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("nm_titulo", newsData.nm_titulo);
        formData.append("ds_subtitulo", newsData.ds_subtitulo);
        formData.append("ds_conteudo", newsData.ds_conteudo);

        //ao enviar ao backend, é necessario passar o filename
        formData.append("url_thumbimg", newsData.url_thumbimg!);
        formData.append("id_site", site!.id_site.toString());
        formData.append("id_usuario", user!.id_usuario.toString());

        if (news) formData.append("id_noticia", news.id_noticia.toString());

        if (thumbnailSlot) formData.append("images", thumbnailSlot.file);

        selectedTags.forEach((tag) => formData.append("tags", tag.id_tag.toString()));
        imageSlots.forEach((slot) => formData.append('images', slot.file))

        const slotsJson = JSON.stringify(paragraphSlots);
        console.log(slotsJson);

        formData.append('paragraphs', slotsJson);
        //await postNewsAsync(formData);

    }, [ newsData, imageSlots, postNewsAsync, news, site, user, thumbnailSlot, selectedTags ]);

    const handleChangeParagraphSlotData = useCallback((value : string) => {

    }, [paragraphSlots]);

    const handleDeleteParagraphSlot = useCallback((idSlot : string|number) => {
        setParagraphsSlots(
            paragraphSlots.filter(slot => slot.id_paragrafo != idSlot)
        )
    }, [paragraphSlots, setParagraphsSlots]);

    const handleChangeSlotImage = useCallback((e : ChangeEvent<HTMLInputElement>, id : number|string) => {
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
    }, [ imageSlots ]);

    async function urlToFile(url: string, fileName: string, mimeType?: string): Promise<File>
    {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], fileName, { type: mimeType || blob.type });
    }

    const handleChangeImage = useCallback((e : ChangeEvent<HTMLInputElement>) => {
        const file = e.target!.files![0];
        const imageObject = URL.createObjectURL(file);

        setNewsData({ ...newsData, url_thumbimg : file.name });
        setThumbnailSlot({ file, id: "thumb", fileName: file.name, url : imageObject })
    }, [ newsData ]);

    const handleAddNewSlot = useCallback(() => {
        setImageSlots([...imageSlots, { id : imageSlots.length + 1 } as ImageSlot])
    }, [ imageSlots ])

    const handleRemoveSlot = useCallback((id : string|number) => {
        setImageSlots(imageSlots.filter((slot) => slot.id != id))
    }, [ imageSlots ]);

    useEffect(() => {
        async function mapImageSlotsFromNewsImages () {
            const slotsFromNewsImages = await Promise.all(
                news!.images
                    .filter((img) => img.url != thumbnailSlot.url)
                    .map(async(img, idx) => {
                    const file = await urlToFile(img.url, img.fileName, img.contentType);
                    return {
                        url : img.url,
                        fileName : img.fileName,
                        id : idx,
                        file
                    } as ImageSlot
                })
            );
            setImageSlots(slotsFromNewsImages);
        }

        if (news && news.images && news.images.length > 0)
        {
            mapImageSlotsFromNewsImages();
        }
    }, [ news, thumbnailSlot ]);

    useEffect(() => {
        if (!news && params.id)
        {
            getNewsById(Number(params.id)!)
                .then((data) => {
                    setNews(data)
                })
        }
    }, [news]);
    return (
        <>
            <form
                name={"news_detail"}
                id={"news_detail"}
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
            >
                <NewsDetailInput
                    onChangeFn={(e) => setNewsData({ ...newsData, nm_titulo : e.target.value})}
                    value={newsData.nm_titulo ?? ""}
                    placeholder={`${news ? "Editar o título" : "Adicione um título"}`}
                    variant="title"
                    maxLength={200}
                />
                <NewsDetailInput
                    onChangeFn={(e) => setNewsData({ ...newsData, ds_subtitulo : e.target.value})}
                    value={newsData.ds_subtitulo ?? ""}
                    placeholder={`${news ? "Editar o subtítulo" : "Adicione um subtítulo"}`}
                    variant="subtitle"
                    maxLength={500}
                />
                <NewsDetailInput
                    onChangeFn={(e) => setNewsData({ ...newsData, ds_conteudo : e.target.value })}
                    value={newsData.ds_conteudo ?? ""}
                    placeholder={`${news ? "Editar o paragrafo" : "Adicione um paragrafo de introdução"}`}
                    variant="paragraph"
                    maxLength={2000}
                />
                {
                    paragraphSlots.length > 0 && (
                        paragraphSlots.map((paragraphSlot) => (
                            <section
                                key={paragraphSlot.id_paragrafo}
                                className={"flex gap-1 flex-col px-4 py-5 rounded-2xl border border-zinc-100 bg-zinc-100 relative"}
                            >
                                <Button
                                    className={"bg-red-400 hover:bg-red-500 w-fit p-2 text-zinc-50  absolute -right-10 top-0 rounded-lg  "}
                                    icon={X}
                                    description={"Remover paragrafo"}
                                    onClick={() => handleDeleteParagraphSlot(paragraphSlot.id_paragrafo!)}
                                />
                                <NewsDetailInput
                                    value={paragraphSlot.ds_subtitulo}
                                    onChangeFn={() => console.log("a")}
                                    variant={"subtitle"}
                                    placeholder={"Adicione um subtitulo opcional ao paragrafo"}
                                />
                                <NewsDetailInput
                                    value={paragraphSlot.ds_paragrafo}
                                    onChangeFn={() => console.log("a")}
                                    variant={"paragraph"}
                                    placeholder={"Texto do paragrafo aparecerá aqui"}
                                />
                            </section>

                        ))
                    )
                }
                <Button
                    icon={Plus}
                    onClick={() => setParagraphsSlots(prev => ([...prev, { id_paragrafo : crypto.randomUUID() } as Paragraph]))}
                    description={"Adicionar paragrafo"}
                    className={"w-fit self-end"}
                    title={"Adicione um paragrafo"}
                />
                <section className="relative">
                    <img
                        alt={"Imagem de thumbnail da noticia"}
                        src={thumbnailSlot.url}
                        className="w-full h-fit rounded-2xl shadow-lg "
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
                    <Button
                        description={"Adicionar novo slot para imagem"}
                        className={"w-fit self-end mt-2"}
                        icon={Plus}
                        onClick={handleAddNewSlot}
                        title={"Adicione uma imagem"}
                    />
                    <section className={" w-full grid md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 overscroll-x-auto"}>
                        {
                            imageSlots.length > 0 && (
                                imageSlots.map((slot, idx) => (
                                    <ImageSlotFc
                                        key={slot.id}
                                        handleChangeSlotImage={handleChangeSlotImage}
                                        idx={idx}
                                        handleRemoveSlot={handleRemoveSlot}
                                        slot={slot}
                                    />

                                ))
                            )
                        }
                    </section>
                </footer>

            </form>
            <h5 className={"text-lg"}>
                Tags
            </h5>
            <section className={"rounded-2xl bg-zinc-50 border border-zinc-200 p-4 flex flex-wrap gap-2"}>

                <Dialog.Root
                    open={isDialogOpen}
                    onOpenChange={setDialogOpen}
                >
                    <Dialog.Trigger asChild>
                        <Button
                            description={"Buscar tags"}
                            icon={Search}
                        />
                    </Dialog.Trigger>
                    <Dialog.Portal >
                        <Dialog.Overlay className={"z-50 fixed inset-0 w-screen bg-zinc-900/30 backdrop-blur-md"}/>
                        <TagSearchDialog
                            setDialogOpen={setDialogOpen}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                        />
                    </Dialog.Portal>
                </Dialog.Root>
                {
                    selectedTags.length >0 && (
                        selectedTags.map((tag)=> (
                            <span
                                key={tag.id_tag}
                                className={"rounded-lg flex items-center bg-zinc-100 p-2 gap-2 border border-zinc-200 hover:bg-zinc-200 transition duration-150"}
                            >
                              {tag.nm_slug}
                                    <Button
                                        description={"Remover tag"}
                                        icon={X}
                                        className={"p-1"}
                                        onClick={() => handleSelectTag(tag)}
                                    />
                              </span>
                            )
                        )
                    )
                }
            </section>
            <Button
                form={"news_detail"}
                disabled={isPending}
                isLoading={isPending}
                type="submit"
                title="Salvar"
                className="self-end"
                icon={Check}
            />
        </>

    );
}
