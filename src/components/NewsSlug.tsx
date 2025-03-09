import { useNavigate } from "react-router-dom";
import { TextButton } from "../UI/TextButton";

interface Props {
    tag : string; 
    title : string; 
    id : string 
}
export function NewsSlug ({ id, tag, title } : Props) 
{
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/noticia/${id}`);
    }
    return (
        <div className="flex flex-col gap-2">
            <TextButton
            
                onClick={handleNavigate}
                title={tag}
                className="border-b border-b-transparent hover:border-b-zinc-900 transition duration-200"
            />
            <h1 className="text-lg font-semibold ">
                { title }
            </h1>
        </div>
    );
}