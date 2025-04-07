import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "../../utils/animations.css"
import { Button } from "../../UI/Button.tsx";
import React from "react";
import { Trash } from "lucide-react";
interface IAlertDialogProps
{
    message: string;
    title? : string;
    action : (...args  : any[]) => void;
    buttonActionMessage? : string;
}
export const AlertDialogComponent = React.forwardRef<HTMLDivElement, IAlertDialogProps> (
    ({
         action,
         message,
         title,
         buttonActionMessage
     } : IAlertDialogProps, ref)  =>
    {
        return (
            <article className="w-full h-full flex items-center justify-center">
                <AlertDialog.Content  ref={ref} className=" w-[400px] h-[150px] flex flex-col z-[100000] justify-between top-14 on-open-modal backdrop-blur-md rounded-lg bg-zinc-200 dark:bg-zinc-800  shadow-2xl py-3 px-4 fixed  ">
                    <header className="flex flex-col">
                        <AlertDialog.Title className="dark:text-zinc-50 text-2xl font-bold t">
                            {title ? title : "Deseja continuar?"}
                        </AlertDialog.Title>
                        {
                            message && (
                                <AlertDialog.Description className="text-md opacity-80 font-semibold text-zinc-900 dark:text-zinc-300">
                                    {message}
                                </AlertDialog.Description>
                            )
                        }
                    </header>
                    <footer className="flex gap-2 self-end ">
                        <AlertDialog.Cancel asChild>
                            <Button
                                title="Cancelar"
                                className="dark:text-white text-white text-md rounded-lg bg-zinc-500 px-4 hover:bg-zinc-600  dark:hover:bg-zinc-900 font-bold dark:font-normal"
                            />
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild >
                            <Button
                                onClick={action}
                                icon={Trash}
                                className=" text-white text-md font-bold rounded-lg bg-red-400 dark:hover:bg-red-500 px-4 py-1  hover:bg-red-500 flex gap-2  dark:bg-opacity-90 dark:font-normal"
                                title={`${buttonActionMessage ? `${buttonActionMessage}` : "Sim, continuar" }`}
                            />
                        </AlertDialog.Action>
                    </footer>
                </AlertDialog.Content>
            </article>

        );
    })