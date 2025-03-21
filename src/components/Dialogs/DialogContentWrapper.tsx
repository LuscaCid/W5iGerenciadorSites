import { ReactNode } from "react";

export function DialogContentWrapper ({children} : {children : ReactNode})
{
    return (
        <div
            className="w-screen h-full m-auto flex items-center justify-center"
        >
            {
                children
            }
        </div>
    );
}