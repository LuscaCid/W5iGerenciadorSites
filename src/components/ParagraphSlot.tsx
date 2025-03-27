import {Button} from "../UI/Button.tsx";
import {Grip, X} from "lucide-react";
import {NewsDetailInput} from "./NewsDetailInputs.tsx";
import {Paragraph} from "../@types/Paragraph";
import {ChangeInputValueType} from "./NewsDetailAdmin.tsx";
import {Reorder, useDragControls, useMotionValue} from "framer-motion";

interface Props {
    handleDeleteParagraphSlot : (id : number|string) => void;
    paragraph : Paragraph,
    handleChangeParagraphSlotData : (type : ChangeInputValueType, value : string, id : string|number) => void;
}
export const ParagraphSlot = ({ paragraph, handleDeleteParagraphSlot, handleChangeParagraphSlotData } : Props) => {
    const y = useMotionValue(0);
    const dragControls = useDragControls();
    return (
        <Reorder.Item
            id={paragraph.id_paragrafo}
            dragControls={dragControls}
            dragListener={false}
            value={paragraph.id_paragrafo}
            initial={{opacity : 0}}
            animate={{opacity : 1}}
            exit={{opacity : 0}}
            style={{y}}
            className={"flex gap-1 flex-col mb-4 px-4 py-5 rounded-2xl border border-zinc-100 bg-zinc-100 relative"}
        >
            <button
                type={"button"}
                className={"absolute -left-10 top-0 p-2 w-fit reorder-handle cursor-grab bg-zinc-100 rounded-lg"}
                onPointerDown={(event) => dragControls.start(event)}
            >
                <Grip size={15}/>
            </button>

            <Button
                className={"bg-red-400 hover:bg-red-500 w-fit p-2 text-zinc-50  absolute -right-10 top-0 rounded-lg  "}
                icon={X}
                description={"Remover paragrafo"}
                onClick={() => handleDeleteParagraphSlot(paragraph.id_paragrafo!)}
            />
            <NewsDetailInput
                value={paragraph.ds_subtitulo}
                onChangeFn={(e) => handleChangeParagraphSlotData("ds_subtitulo", e.target.value, paragraph.id_paragrafo!)}
                variant={"subtitle"}
                placeholder={"Adicione um subtitulo opcional ao paragrafo"}
            />
            <NewsDetailInput
                value={paragraph.ds_paragrafo}
                onChangeFn={(e) => handleChangeParagraphSlotData("ds_paragrafo", e.target.value, paragraph.id_paragrafo!)}
                variant={"paragraph"}
                placeholder={"Texto do paragrafo aparecerá aqui"}
            />
        </Reorder.Item>
    );
}