import {Button} from "../UI/Button.tsx";
import {Pencil, Trash} from "lucide-react";
import {ImageSlot} from "./NewsDetailAdmin.tsx";
import DefaultImage from "/default-featured-image.jpg";
import {Tooltip} from "@mui/material";
import {ChangeEvent} from "react";

interface Props {
    slot : ImageSlot;
    idx: number;
    handleRemoveSlot : (id : number|string) => void;
    handleChangeSlotImage : (e : ChangeEvent<HTMLInputElement>, id : number|string) => void;
}
export const ImageSlotFc = ({ slot, handleRemoveSlot,handleChangeSlotImage, idx } : Props) => {
    return (
        <div
            key={idx.toString()}
            className={"group overflow-hidden relative shadow-lg rounded-lg"}
        >
            <img
                className={"w-full rounded-lg max-w-[500px] aspect-video"}
                alt={"imagem da noticia"}
                src={slot.url ? slot.url : DefaultImage}

            />
            <div
                className={"absolute right-2 -top-14 group-hover:top-2 transition-all duration-300 opacity-20 group-hover:opacity-100  flex items-center gap-2"}
            >
                <Button
                    description={"Excluir notícia"}
                    className={"rounded-full bg-red-500 shadow-lg text-zinc-100 h-10 w-10 p-0 items-center justify-center z-50 hover:bg-red-600"}
                    icon={Trash}
                    onClick={() => handleRemoveSlot(slot.id)}
                />

                <Tooltip
                    enterDelay={300}
                    enterNextDelay={300}
                    title={"Editar imagem"}
                >

                    <label
                        className={"text-zinc-50 shadow-lg cursor-pointer rounded-full flex items-center justify-center h-10 w-10 bg-blue-400 hover:bg-blue-500  duration-150"}
                        htmlFor={"image_slot" + idx.toString()}
                    >
                        <Pencil size={15} />
                    </label>

                </Tooltip>
            </div>

            <input
                onChange={(e) => handleChangeSlotImage(e, slot.id)}
                className={"sr-only"}
                id={"image_slot" + idx.toString()}
                type={"file"}
            />
        </div>    );
}