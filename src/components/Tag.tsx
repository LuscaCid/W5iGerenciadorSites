import { IconButton, Tooltip } from "@mui/material";
import { Tag as TagType } from "../@types/News";
import { useUserContext } from "../store/user";
import { Pencil, Trash } from "lucide-react";

interface Props 
{
    tag : TagType;
    selectedTags : TagType[];
    handleSelectTag : (tag : TagType) => void;
}
export const Tag = ({ tag, handleSelectTag, selectedTags } : Props) => {
    const user = useUserContext((state) => state.user);
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
                    onClick={() => handleSelectTag(tag)}
             
                >
                    <span>
                        {tag.nm_slug}
                    </span>
                </div>
                {
                    user && (
                        <div className=" flex items-center gap-2 ">
                            <IconButton color="info">
                                <Pencil size={15}/>
                            </IconButton>   
                            <IconButton color="error">
                                <Trash size={15}/>
                            </IconButton>   
                        </div>
                    )
                }
            </section>
        </Tooltip>
    );
}