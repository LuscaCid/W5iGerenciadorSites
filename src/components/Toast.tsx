import { CircleCheck, CircleX, Info, OctagonAlert } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {JSX, ReactNode, useEffect, useState} from "react";
import {ToastVariants} from "../@types/ToastVariants";
import {createContext} from "use-context-selector";

interface Props {
    children: ReactNode;
}

type ToastStringRecord = Record<ToastVariants, string>;

interface ToastContext
{
    isOpen : boolean;
    message : string;
    variant : ToastVariants;
    open : (message? : string, variant? : ToastVariants) => void;
    close : () => void;
    title : string;
}
export const toastContext = createContext<ToastContext>({
    isOpen: false,
    message: "",
    variant: "success",
    title: "",
    open: () => {},
    close: () => {},
} as ToastContext);
export function Toast({ children } : Props)
{
    const [contextProps, setContextProps] = useState<ToastContext>({
        title: "",
        message: "",
        isOpen: false,
        variant: "success",
        open: (message = "", variant = "success") => {
            setContextProps((prev) => ({
                ...prev,
                message,
                variant,
                isOpen: true,
            }));
        },
        close: () => {
            setContextProps((prev) => ({ ...prev, isOpen: false }));
        },
    });

    const patternStyle = ` w-80 opacity-0 fixed z-[10000] top-5 max-h-[200px] overflow-auto right-5 border rounded-md backdrop-blur-sm p-2 flex flex-col transition duration-500  ${contextProps.isOpen ? " translate-y-2 opacity-100 " : "-translate-y-24 opacity-0"} `;

    const icons  : Record<ToastVariants, JSX.Element > = {
        warning : <OctagonAlert className="text-yellow-700" />,
        error : <CircleX className="text-red-700" />,
        info : <Info className="text-blue-700" />,
        success : <CircleCheck className="text-green-700" />
    };
    const titles : ToastStringRecord ={
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
            info : `border-blue-400 bg-blue-300/50 dark:bg-blue-400/55`,
            error : `border-red-400 bg-red-300/50 dark:bg-red-400/55`,
            warning : `border-yellow-400 bg-yellow-300/50 dark:bg-yellow-400/55`,
            success : `border-green-300 dark:border-green-400 bg-green-300/50 dark:bg-green-400/55 `
        };
    //renderiza o icone conforme o tipo de toast passado retornandop um jsx
    const renderIcon = () => icons[contextProps.variant];
    useEffect(() => {
        if (contextProps.isOpen)
        {
            const timeout = setTimeout(() => contextProps.close(), 6000);
            return () => clearTimeout(timeout);
        }

    }, [ contextProps ]);
    return (
        <toastContext.Provider value={contextProps}>
            <section className={twMerge([patternStyle, applyStyle[contextProps.variant]])}>
                <header className="flex items-center gap-2">
                    <aside>
                        {renderIcon()}
                    </aside>
                    <h1 className="text-lg font-bold ">
                        {contextProps.title ? contextProps.title : titles[contextProps.variant]}
                    </h1>
                </header>
                <footer>
                    <h4 className="text-md">
                        {
                            contextProps.message ? contextProps.message : descriptions[contextProps.variant]
                        }
                    </h4>
                </footer>
            </section>
            {children}
        </toastContext.Provider>
    )
}