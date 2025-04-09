import {ReactNode} from "react";
import {Button} from "../UI/Button.tsx";
import {Pencil, Trash} from "lucide-react";

interface ValueShowProps <T extends object>{
    handleSetToEdit : (object : T) => void;
    handleDelete : (object : T) => void;
    object : T;
    isAdminInUse? : boolean;
    children? : ReactNode;
}
export function AccordionValueShow <T extends object>(props : ValueShowProps<T>)
{
    return (
        <section className="pb-1 border-b border-zinc-300 dark:border-zinc-600 flex w-full flex items-center gap-5">
            {
                props.isAdminInUse && (
                    <>
                        <aside className={"flex items-center gap-1"}>
                            <Button
                                className={"rounded-full p-1 h-10 w-10 text-zinc-100 flex items-center justify-center  bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600" }
                                icon={Pencil}
                                onClick={() => props.handleSetToEdit(props.object)}
                            />
                            <Button
                                className={"rounded-full p-1 h-10 w-10 text-zinc-100 flex items-center justify-center  bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600" }
                                icon={Trash}
                                onClick={() => props.handleDelete(props.object)}
                            />
                        </aside>
                        <div className={"h-10 bg-zinc-300 dark:bg-zinc-900 w-[1px]"}/>
                    </>
                )
            }
            {
                props.children && <>{props.children}</>
            }
        </section>
    );
}