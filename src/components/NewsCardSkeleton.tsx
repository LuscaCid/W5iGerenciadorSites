import {Skeleton} from "@mui/material";
interface Props {
    width? : number
}
export const NewsCardSkeleton = ({ width = 329 } : Props) => {
    return (
        <div className={`flex flex-col relative rounded-t-2xl  rounded-b-2xl shadow-lg max-h-[380px] w-full h-full max-w-[${width}px]`}>
            <Skeleton
                className={"rounded-t-2xl w-full bg-zinc-100 border-none"}
                variant="rectangular"
                animation={"pulse"}
                 height={185}
            />
            <Skeleton
                animation={"wave"}
                height={192}
                variant="rectangular"
                className={"rounded-b-2xl bg-zinc-200 w-full h-full p-4 border-none"}
            />
            <Skeleton variant={"text"} className={"bg-zinc-400 absolute border-none bottom-24 right-4 left-4 "}/>
            <Skeleton variant={"text"} className={"bg-zinc-400 absolute border-none bottom-20 right-4 left-4 "}/>
            <Skeleton variant={"text"} className={"bg-zinc-400 absolute border-none bottom-16 right-4 left-4"}/>
            <Skeleton variant={"text"} className={"bg-zinc-400 absolute border-none bottom-32 right-4 left-4 p-5"}/>
        </div>


    )
}