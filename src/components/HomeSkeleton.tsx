import {Skeleton} from "@mui/material";
import {NewsCardSkeleton} from "./NewsCardSkeleton.tsx";

export const HomeSkeleton = () => {
    return (
        <section className={"flex flex-col gap-10 pt-6 pb-5 w-full"}>
            <Skeleton
                variant={"text"}
                animation={"wave"}
                className={"w-[150px] h-10 dark:bg-zinc-800"}
            />
            <Skeleton
                className="w-full min-h-[250px] dark:bg-zinc-800  rounded-2xl"
                variant={"rectangular"}
                animation={"wave"}
            />
            <Skeleton
                variant={"text"}
                animation={"wave"}
                className={"w-[150px] h-10 dark:bg-zinc-800"}
            />
            <Skeleton
                className="w-full min-h-[250px] dark:bg-zinc-800  rounded-2xl"
                variant={"rectangular"}
                animation={"wave"}
            />
            <Skeleton
                variant={"text"}
                animation={"wave"}
                className={"w-[150px] h-10 dark:bg-zinc-800"}
            />
            <header className={"flex-col md:flex-row flex gap-10 items-start"}>
                <Skeleton
                    className="w-full min-h-[300px] dark:bg-zinc-800 lg:min-h-[450px] 2xl:min-h-[530px] md:w-2/3 rounded-2xl"
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
                                className={"rounded-full h-[30px] shadow-2xl"}
                                width={Math.round(Math.random() * 250) + 100}
                            />
                        ))
                    }
                </aside>
            </header>
            <Skeleton variant={"text"} className={"lg:w-1/4 w-full dark:bg-zinc-800"}/>
            <main className={"grid grid-cols-1 md:grid-cols-3 gap-4 w-2/2"}>
                {Array.from({length : 6}).map((_, i) => (
                    <NewsCardSkeleton width={400} key={i} />
                ))}
            </main>
        </section>
    );
}