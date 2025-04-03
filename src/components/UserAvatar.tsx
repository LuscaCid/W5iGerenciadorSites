import {User} from "lucide-react";

interface  Props {
    title : string;
    clickable? : boolean;
    subtitle? : string;
}
export const UserAvatar = ({ title, clickable = true, subtitle } : Props) => {
    return (
        <div
            className={`flex  items-center gap-2 ${clickable ? "cursor-pointer" : "cursor-default"}`}
        >
            <main
                className='rounded-full h-12 w-12 hover:ring-[6px] outline-3 outline-zinc-50 dark:outline-zinc-800 contain-content shadow-lg hover:ring-blue-500 transition duration-150  flex items-center justify-center bg-zinc-50 dark:bg-zinc-700'
            >
                <User  size={30} />
            </main>
            <span className='hidden  md:flex flex-col text-nowrap select-none hover:underline'>
                {title}
            </span>
            {
                subtitle && (
                    <span className={"text-sm text-zinc-500"}>
                        {subtitle}
                    </span>
                )
            }
        </div>
    );
}
