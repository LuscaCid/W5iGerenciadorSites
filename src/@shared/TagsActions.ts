import {Dispatch, SetStateAction, useCallback} from "react";
import {Tag} from "../@types/Tag";
interface Props {
    selectedTags : Array<Tag>;
    setSelectedTags : Dispatch<SetStateAction<Tag[]>>
}
export const getTagsActions = ({ setSelectedTags, selectedTags } : Props) => {

    const handleSelectTag = useCallback((selectedTag : Tag, ) => {
        const tagAlreadySelected = selectedTags.find((tag) => tag.id_tag == selectedTag.id_tag);
        if (tagAlreadySelected)
        {
            setSelectedTags(
                selectedTags.filter((tag) => tag.id_tag!== selectedTag.id_tag)
            );
            return;
        }
        setSelectedTags([...selectedTags, selectedTag ])
    }, [ setSelectedTags, selectedTags ]);

    return {
        handleSelectTag
    }
}