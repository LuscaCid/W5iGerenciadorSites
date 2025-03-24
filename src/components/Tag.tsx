import { IconButton, Tooltip } from "@mui/material";
import { useUserContext } from "../store/user";
import {Pencil, Trash} from "lucide-react";
import {Tag as TagType} from "../@types/Tag";
import * as Dialog from "@radix-ui/react-dialog";
import {CustomDialogContent} from "./CustomDialogContent.tsx";
import {FormCreateTag} from "./Dialogs/FormCreateTag.tsx";
import {useCallback, useState} from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {AlertDialogComponent} from "./Dialogs/AlertDialogComponent.tsx";
import {useTags} from "../hooks/useTags.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "./Toast.tsx";
import {AxiosError} from "axios";

interface Props
{
    tag : TagType;
    selectedTags : TagType[];
    handleSelectTag : (tag : TagType) => void;
    canOpen? : boolean;
    handleEditTag? : (tag : TagType) => void;
}
export const Tag = ({ tag, handleSelectTag, selectedTags, canOpen = true, handleEditTag } : Props) => {
    const user = useUserContext((state) => state.user);
    const openToast = useContextSelector(toastContext, (context) => context.open);

    const [ isDialogOpen, setDialogOpen ] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const { deleteTag } = useTags();

    const { mutateAsync : deleteTagAsync } = useMutation({
        mutationFn : deleteTag,
        mutationKey: ["delete-tag"],
        onSuccess :(_, variables) => {
            queryClient.setQueryData(["tags"], (prev : TagType[]) => (
                 prev.filter(tag => tag.id_tag != variables)
            ))
            openToast("Tag excluída", "success")
        },
        onError : (err : AxiosError) => {
            if (err.response)
            {
                openToast((err.response.data as { message: string }).message, "error")
            }
        }
    })
    const handleDeleteTag = useCallback(async(id : number) => {
        await deleteTagAsync(id)
    }, [deleteTagAsync]);
    return (
        <Tooltip
            key={tag.id_tag}
            enterDelay={400}
            enterNextDelay={400}
            title="Marcar para filtrar resultados"
        >
            <section
                className={`w-fit select-none flex items-center justify-center gap-2 transition shadow-lg duration-200 rounded-full py-1 px-3  text-nowrap overflow-ellipsis overflow-hidden  cursor-pointer ${selectedTags.find((selectedTag) => selectedTag.id_tag === tag.id_tag) ? "bg-blue-200  hover:bg-blue-300 text-black" : "bg-zinc-100 hover:bg-zinc-300"} transition duration-150`}
            >
                <div 
                    onPointerDown={() => handleSelectTag(tag)}
                >
                    <span>
                        {tag.nm_slug}
                    </span>
                </div>
                {
                    user && (
                        <div className=" flex items-center gap-1 ">
                            <Dialog.Root open={isDialogOpen && canOpen} onOpenChange={setDialogOpen}>
                                <Dialog.Trigger asChild>
                                    <IconButton
                                        onClick={() => {
                                            if (handleEditTag)
                                            {
                                                handleEditTag(tag)
                                            }
                                        }}
                                        color="info" >
                                        <Pencil size={15}/>
                                    </IconButton>
                                </Dialog.Trigger>
                                <Dialog.Portal >
                                    <Dialog.Overlay className={"z-50 fixed inset-0 w-screen bg-zinc-900/30 backdrop-blur-md"}/>
                                    <CustomDialogContent className={"w-[90%] h-1/4  lg:h-[300px] lg:w-1/3"}>
                                        <FormCreateTag tag={tag}/>
                                    </CustomDialogContent>
                                </Dialog.Portal>
                            </Dialog.Root>
                            <AlertDialog.Root >
                                <AlertDialog.Trigger asChild>
                                    <IconButton color="error">
                                        <Trash size={15}/>
                                    </IconButton>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal >
                                    <AlertDialog.Overlay/>
                                    <AlertDialogComponent
                                        action={() => handleDeleteTag(tag.id_tag!)}
                                        title="Excluir Tag?"
                                        message="confirmar"
                                        buttonActionMessage="Excluir"
                                    />
                                </AlertDialog.Portal>
                            </AlertDialog.Root>
                        </div>
                    )
                }
            </section>
        </Tooltip>
    );
}