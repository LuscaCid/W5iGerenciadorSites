import { AlertCircle } from "lucide-react";

export function NotFound()
{
    return (
        <main className="w-full h-full flex items-start mb-10 lgitems-center justify-start lg:justify-center 2">
            <span className="text-lg 2xl:text-6xl mt-10 lg:mt-20 lg:text-4xl md:text-2xl px-4 py-2 lg:py-10 lg:px-5 2x1:p-10 rounded-lg bg-zinc-300 dark:bg-zinc-800 font-bold flex items-center gap-2 select-none">
                Página não encontrada, erro 404 <AlertCircle size={60}/>
            </span>
        </main>
    )
}