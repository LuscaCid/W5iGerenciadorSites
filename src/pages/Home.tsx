import { NewsCarousel } from "../components/NewsCaroussel"
import { NewsSection } from "../components/NewsSection";
import {useQuery} from "@tanstack/react-query";
import {useNews} from "../hooks/useNews.ts";
import {HomeSkeleton} from "../components/HomeSkeleton.tsx";
import {BannerSection} from "../components/BannerSection.tsx";
import {Title} from "../components/Title.tsx";
import {SectionsScroll} from "../constants/SectionsScroll.ts";
import {ServicesTabsSection} from "../components/ServicesTabsSection.tsx";
import {useLinks} from "../hooks/useLinks.ts";
import {useBanners} from "../hooks/useBanners.ts";

export const Home = () => {
    const { getNews } = useNews();
    const { getLinks } = useLinks();
    const { getBanners } = useBanners();
    const {data, isLoading} = useQuery({
        queryFn : async () => await getNews({ page : 1, nm_titulo : "", tags :""  }),
        queryKey : ["news"]
    })
    const { data : banners, isLoading : isLoadingBanners } = useQuery({
        queryFn : async () => await getBanners(),
        queryKey : ["banners"]
    });
    const { data : links, isLoading : isLoadingLinks } = useQuery({
        queryFn : async () => await getLinks(),
        queryKey : ["links"]
    })
    return (
    <div className="flex flex-col gap-5 pb-5 w-full">
        {
            isLoading || isLoadingBanners || isLoadingLinks ? (
                <HomeSkeleton />
            ) : (
                <>
                    <Title id={SectionsScroll.banner} title={"Destaques"}/>
                    <BannerSection banners={banners ?? []}/>
                    <Title id={SectionsScroll.services} title={"Serviços"}/>
                    <ServicesTabsSection services={links ?? []} />
                    <Title id={SectionsScroll.news} title={"Notícias"}/>
                    {
                        data && data.length > 0 && (
                            <div id={"news"}>
                                <NewsCarousel news={data.slice(
                                    0, data.length >= 6 ? 6 : 3)}/>
                                <h1
                                    className={"text-lg font-semibold mb-6"}
                                >
                                    Mais noticias
                                </h1>
                                <NewsSection news={data.slice(6, data.length >= 12 ? 12 : 9)} />
                            </div>
                        )
                    }
                </>
            )
        }
    </div>
    )
}