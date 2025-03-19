import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "../utils/animations.css"
import { Button } from "../UI/Button";
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
                <AlertDialog.Content  ref={ref} className=" w-[400px] h-[150px] flex flex-col z-[100000] justify-between top-14 on-open-modal backdrop-blur-md rounded-lg bg-zinc-200 shadow-2xl py-3 px-4 fixed  ">
                    <header className="flex flex-col">
                        <AlertDialog.Title className="dark:text-zinc-950 text-2xl font-bold t">
                            {title ? title : "Deseja continuar?"}
                        </AlertDialog.Title>
                        {
                            message && (
                                <AlertDialog.Description className="text-md opacity-80 font-semibold text-zinc-900">
                                    {message}
                                </AlertDialog.Description>
                            )
                        }
                    </header>
                    <footer className="flex gap-2 self-end ">
                        <AlertDialog.Cancel asChild>
                            <Button
                                title="Cancelar"
                                className="dark:text-white text-md rounded-lg bg-red-400 px-4 hover:bg-red-500 font-bold dark:font-normal"
                            />
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild >
                            <Button
                                onClick={action}
                                icon={Trash}
                                className="text-white text-md rounded-lg bg-red-400 px-4 py-1 hover:bg-red-500 flex-row-reverse flex gap-2 font-normal dark:bg-opacity-90"
                                title={`${buttonActionMessage ? `${buttonActionMessage}` : "Sim, continuar" }`}
                            />
                        </AlertDialog.Action>
                    </footer>
                </AlertDialog.Content>
            </article>

        );
    })