import * as Dialog from "@radix-ui/react-dialog";
import {TextButton} from "../UI/TextButton.tsx";
import {X} from "lucide-react";
import {ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import "../utils/animations.css";

interface Props {
    children : ReactNode;
    className? : string;
}

export const CustomDialogContent = ({ children, className } : Props) => (
    <Dialog.Content className={twMerge(["on-open-modal fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-auto rounded-2xl border flex flex-col lg:flex-row gap-2   z-[100] border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 "], [className]) }>
        <Dialog.Close
            asChild
        >
            <TextButton
                className={"absolute z-50 top-3 right-3 hover:bg-red-500 transition duration-200 items-center justify-center flex rounded-lg bg-red-400  cursor-pointer"}
                icon={X}
                type={"button"}
                iconSize={15}
            />
        </Dialog.Close>
        {children}
    </Dialog.Content>
)
