import {Skeleton} from "@mui/material";
import {NewsCardSkeleton} from "./NewsCardSkeleton.tsx";

export const HomeSkeleton = () => {
    return (
        <section className={"flex flex-col gap-5 pb-5 w-full"}>
            <header className={"flex-col md:flex-row flex gap-10 items-start"}>
                <Skeleton
                    className="w-full min-h-[300px] lg:min-h-[450px] 2xl:min-h-[530px] md:w-2/3 rounded-2xl"
                    variant={"rectangular"}
                    animation={"wave"}
                >

                </Skeleton>
                <aside className={"flex flex-col gap-5 w-full md:w-1/3"}>
                    {
                        Array.from({length : 10}).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant={"rectangular"}
                                animation={"wave"}
                                className={"w-[70%]"}
                            />
                        ))
                    }
                </aside>
            </header>
            <Skeleton variant={"text"} className={"lg:w-1/4 w-full"}/>
            <main className={"grid grid-cols-1 md:grid-cols-3 gap-4 w-2/2"}>
                {Array.from({length : 6}).map((_, i) => (
                    <NewsCardSkeleton width={400} key={i} />
                ))}
            </main>
        </section>
    );
}