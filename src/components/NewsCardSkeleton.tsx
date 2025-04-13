import {Skeleton} from "@mui/material";
interface Props {
    width? : number
}
export const NewsCardSkeleton = ({ width = 329 } : Props) => {
    return (
        <div className={`flex flex-col relative rounded-t-2xl  rounded-b-2xl shadow-lg max-h-[380px] w-full h-full max-w-[${width}px]`}>
            <Skeleton
                className={"rounded-t-2xl dark:bg-zinc-800"}
                variant="rectangular"
                animation={"pulse"}
                 height={185}
            />
            <Skeleton
                className={"rounded-b-2xl dark:bg-zinc-800"}
                animation={"wave"}
                height={192}
                variant="rectangular"
            />
            <Skeleton variant={"text"} className={"dark:bg-zinc-700 absolute border-none bottom-24 right-4 left-4 "}/>
            <Skeleton variant={"text"} className={"dark:bg-zinc-700 absolute border-none bottom-20 right-4 left-4 "}/>
            <Skeleton variant={"text"} className={"dark:bg-zinc-700 absolute border-none bottom-16 right-4 left-4"}/>
            <Skeleton variant={"text"} className={"dark:bg-zinc-700 absolute border-none bottom-32 right-4 left-4 p-5"}/>
        </div>


    )
}