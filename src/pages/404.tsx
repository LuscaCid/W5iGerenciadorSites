import { AlertCircle } from "lucide-react";

export function NotFound()
{
    return (
    <main className="w-full h-full flex items-center justify-center">
          <span className="2xl:text-6xl mt-20 lg:text-4xl md:text-2xl p-2 2x1:p-10 rounded-lg bg-zinc-300 dark:bg-zinc-800 font-bold flex items-center gap-2 select-none">
                Página não encontrada, erro 404 <AlertCircle size={60}/>
          </span>
    </main>
    )
}