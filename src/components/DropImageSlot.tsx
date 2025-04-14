import {twMerge} from "tailwind-merge";
import {Button} from "../UI/Button.tsx";
import {Trash} from "lucide-react";
import {DropzoneInputProps, DropzoneRootProps} from "react-dropzone";

interface DropzoneSlotProps <U extends string> {
    getRootProps : <T extends DropzoneRootProps>(props?: T) => T
    getInputProps : <T extends DropzoneInputProps>(props?: T) => T;
    imagePreview? : string;
    handleDeleteImage : (id : string) => void;
    isDragActive : boolean;
    className? : string;
    description? : string;
    name : U;
}
export function DropImageSlot <U extends string>(
    {
        name,
        imagePreview,
        getRootProps,
        getInputProps,
        className,
        isDragActive,
        handleDeleteImage,
        description
    } : DropzoneSlotProps<U>
)
{
    const patternStyle = `rounded-full ${!imagePreview ? "border-dashed border-[4px]" : ""} w-full flex h-[250px] w-[250px] items-center justify-center font-bold  text-lg text-zinc-800 dark:text-zinc-500  border-zinc-200 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-700 transition duration-150 ${isDragActive ? "animate-pulse" : ""}`;

    return (
        <article className={"relative w-fit h-[250px]"}>
            <button
                type={"button"}
                id={name}
                className={twMerge([patternStyle], [className])}
                {...getRootProps()}
            >
                <input {...getInputProps()} id={name} name={name} />
                {
                    imagePreview ? (
                        <img src={imagePreview} alt={""} className={"w-full"} />
                    ) : (
                        isDragActive ?
                            <p className={"m-10"} id={name}>Solte o arquivo aqui</p> :
                            <p className={"m-10"} id={name}>{description ? description : "clique ou arraste aqui o arquivo"}</p>
                    )
                }
            </button>
            <Button
                icon={Trash}
                className={`${imagePreview ? "opacity-100" : "opacity-0"} transition-all duration-150 bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 absolute bottom-3 right-3 rounded-full p-1 h-10 w-10 flex items-center justify-center z-30`}
                onClick={() => handleDeleteImage(name)}
            />
        </article>
    )
}