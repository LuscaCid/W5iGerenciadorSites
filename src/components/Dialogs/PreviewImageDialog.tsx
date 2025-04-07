import {CustomDialogContent} from "../CustomDialogContent.tsx";
import * as Dialog from "@radix-ui/react-dialog"
interface Props {
    src : string;
    alt : string;
}
export const PreviewImageDialog = ({src, alt} : Props) => {
    return (
        <CustomDialogContent className={"w-[90%]  lg:w-fit lg:h-fit"}>
            <Dialog.Title className={"sr-only"}>
                Pré Visualização de imagem
            </Dialog.Title>
            <img src={src} alt={alt} className={"w-full rounded-lg"}/>
        </CustomDialogContent>
    );
}