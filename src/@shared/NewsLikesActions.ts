import {useCallback} from "react";
import {Noticia} from "../@types/News";
import {StorageKeys} from "../constants/StorageKeys.ts";
import {QueryClient, UseMutateAsyncFunction} from "@tanstack/react-query";
import {DislikeNewsDto, LikeNewsDto} from "../hooks/useNews.ts";
import {Like} from "../components/NewsCard.tsx";

interface Props {
    queryClient : QueryClient;
    news : Noticia;
    likeAsync :  UseMutateAsyncFunction<void, Error, LikeNewsDto, unknown>;
    dislikeAsync :  UseMutateAsyncFunction<void, Error, DislikeNewsDto, unknown>;
}

/**
 * @summary Seguindo o padrao de factory, uma fabrica de funcionalidades correlatas ao like da notícia ou dislike
 * @param queryClient
 * @param news
 * @param likeAsync
 * @param dislikeAsync
 * @constructor
 */
export function NewsLikesActions ({
    queryClient,
    news,
    likeAsync,
    dislikeAsync,
} : Props )
{

    /**
     * @summary vai aumentar o numero de dislikes na notícia dentro do contexto em caso de não ter dado o like ainda
     * @param boolean plus, a depender da ação vai diminui um ou aumentar um like
     * @author Lucas Cid
     */
    const toggleDislike = useCallback((plus : boolean) => {
        queryClient.setQueryData(["news"], (prev : Noticia[]) => (
            prev.map((prevNews) => {
                if (prevNews.id_noticia == news.id_noticia)
                {
                    return {
                        ...prevNews,
                        nu_dislike : plus ? (prevNews.nu_dislike! + 1) : (prevNews.nu_dislike! - 1)
                    } as Noticia
                }
                return prevNews;
            })
        ));
    }, [ queryClient, news ]);

    const unDislikeFromStorageAndDatabase = useCallback(async (storageDislikes : Like[]) => {
        //remover do localStorage
        const likesWithoutUnliked = storageDislikes.filter((like) => like.id_news != news.id_noticia);
        localStorage.setItem(StorageKeys.dislike, JSON.stringify(likesWithoutUnliked));

        toggleDislike(false);

        await dislikeAsync({id_news : news.id_noticia!, unDislike : true});
    }, [ toggleDislike, dislikeAsync, news.id_noticia ]);

    const dislikeInStorageAndDatabase = useCallback(async (storageLikes : Like[]) => {
        const dislike : Like = { id_news : news.id_noticia! };
        localStorage.setItem(StorageKeys.dislike, JSON.stringify([ ...storageLikes, dislike ]));

        await removeLikeIfExistsAfterDislike();

        toggleDislike(true);

        await dislikeAsync({id_news : news.id_noticia!, unDislike : false});
    }, [ dislikeAsync, news.id_noticia, toggleDislike ])

    const removeLikeIfExistsAfterDislike = useCallback(async() => {
        const likesFromStorage = JSON.parse(localStorage.getItem(StorageKeys.like) ?? "[]") as Like[];
        let likesUpdated = likesFromStorage.filter(like => like.id_news != news.id_noticia);

        localStorage.setItem(StorageKeys.like, JSON.stringify(likesUpdated));

        //se realmente haviam likes
        if (likesFromStorage.length != likesUpdated.length) await unlikeFromStorageAndDatabase(likesUpdated);

    }, [news.id_noticia]);

    const removeDislikeIfExistsAfterLike = useCallback(async() => {
        const dislikesFromStorage = JSON.parse(localStorage.getItem(StorageKeys.dislike) ?? "[]") as Like[];
        let dislikesUpdated = dislikesFromStorage.filter(dislike => dislike.id_news != news.id_noticia);

        localStorage.setItem(StorageKeys.dislike, JSON.stringify(dislikesUpdated));

        //se realmente haviam likes
        if (dislikesFromStorage.length != dislikesUpdated.length) await unDislikeFromStorageAndDatabase(dislikesUpdated);
    }, [news.id_noticia])


    // seção para funções correlatas ao like
    /**
     * @summary vai aumentar o numero de likes na notícia dentro do contexto em caso de não ter dado o like ainda
     * @param boolean plus, a depender da ação vai diminui um ou aumentar um like
     * @author Lucas Cid
     */
    const toggleLike = useCallback((plus : boolean) => {
        queryClient.setQueryData(["news"], (prev : Noticia[]) => (
            prev.map((prevNews) => {
                if (prevNews.id_noticia == news.id_noticia)
                {
                    return {
                        ...prevNews,
                        nu_like : plus ? (prevNews.nu_like! + 1) : (prevNews.nu_like! - 1)
                    } as Noticia
                }
                return prevNews;
            })
        ));
    }, [ queryClient, news ]);

    const unlikeFromStorageAndDatabase = useCallback(async (storageLikes : Like[]) => {
        //remover do localStorage
        const likesWithoutUnliked = storageLikes.filter((like) => like.id_news != news.id_noticia);
        localStorage.setItem(StorageKeys.like, JSON.stringify(likesWithoutUnliked));

        toggleLike(false);

        await likeAsync({id_news : news.id_noticia!, unlike : true});
    }, [ toggleLike, likeAsync, news.id_noticia ]);

    const likeInStorageAndDatabase = useCallback(async (storageLikes : Like[]) => {
        const like : Like = { id_news : news.id_noticia! };
        localStorage.setItem(StorageKeys.like, JSON.stringify([ ...storageLikes, like ]));

        await removeDislikeIfExistsAfterLike();

        toggleLike(true);
        await likeAsync({id_news : news.id_noticia!, unlike : false});
    }, [ likeAsync, news.id_noticia, toggleLike, removeDislikeIfExistsAfterLike ])


    return {
        unDislikeFromStorageAndDatabase,
        dislikeInStorageAndDatabase,
        likeInStorageAndDatabase,
        unlikeFromStorageAndDatabase,
        toggleLike,
    }
}