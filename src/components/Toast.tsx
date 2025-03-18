import { CircleCheck, CircleX, Info, OctagonAlert } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {JSX, useEffect} from "react";
import {ToastVariants} from "../@types/ToastVariants";
import {useToastContext} from "../store/toast.ts";

export interface IToastProps {
    className? : string;
    title? : string;
}

type ToastStringRecord = Record<ToastVariants, string>;

export function Toast({ className, title } : IToastProps)
{
    const { close, isOpen, message, variant } = useToastContext();

    const patternStyle = ` w-80 opacity-0 fixed z-[100] top-5 max-h-[200px] overflow-auto right-2 border rounded-md backdrop-blur-sm p-2 flex flex-col transition duration-500  ${isOpen ? " translate-y-2 opacity-100 " : "-translate-y-20 opacity-0     "} `;

    const icons  : Record<ToastVariants, JSX.Element > = {
        warning : <OctagonAlert className="text-yellow-700" />,
        error : <CircleX className="text-red-700" />,
        info : <Info className="text-blue-700" />,
        success : <CircleCheck className="text-green-700" />
    };
    const titles : ToastStringRecord =
        {
            info : "Info",
            error : "Erro",
            warning : "Atenção",
            success : "Sucesso"
        };
    const descriptions: Record<ToastVariants, string> = {
        info: "Informação importante: fique atento às novidades.",
        error: "Ops! Algo deu errado. Por favor, tente novamente.",
        warning: "Atenção! Há algo que você precisa verificar.",
        success: "Sucesso! A operação foi concluída com êxito."
    };
    const applyStyle :ToastStringRecord =
        {
            info : `border-blue-500 bg-blue-300/50 dark:bg-blue-500/55`,
            error : `border-red-500 bg-red-300/50 dark:bg-red-500/55`,
            warning : `border-yellow-500 bg-yellow-300/50 dark:bg-yellow-500/55`,
            success : `border-green-300 dark:border-green-500 bg-green-300/50 dark:bg-green-500/55 `
        };
    //renderiza o icone conforme o tipo de toast passado retornandop um jsx
    const renderIcon = () => icons[variant];
    useEffect(() => {
        if (isOpen)
        {
            const timeout = setTimeout(() => close(), 6000);
            return () => clearTimeout(timeout);
        }

    }, [isOpen]);
    return (
        <section className={twMerge([patternStyle, applyStyle[variant], className])}>
            <header className="flex items-center gap-2">
                <aside>
                    {renderIcon()}
                </aside>
                <h1 className="text-lg font-bold ">
                    {title ? title : titles[variant]}
                </h1>
            </header>
            <footer>
                <h4 className="text-md">
                    {
                        message ? message : descriptions[variant]
                    }
                </h4>

            </footer>
        </section>
    )
}