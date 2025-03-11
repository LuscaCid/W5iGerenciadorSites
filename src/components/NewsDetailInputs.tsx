import { ChangeEvent } from "react";

type Variant = "title" | "subtitle" | "paragraph"
interface Props 
{
    value : string;
    onChangeFn : (e : ChangeEvent<HTMLTextAreaElement>) => void;
    variant : Variant;
    placeholder : string;
    type? : string;
    maxLength? : number;
}
export const NewsDetailInput = (
{ 
    placeholder, 
    variant, 
    maxLength, 
    onChangeFn, 
    value 
} : Props) => 
{
    const styleAccordinVariant : Record<Variant, string> = {
        title : "font-[700] text-4xl text-zinc-800 max-h-[230px] min-h-[50px]",
        subtitle : "text-2xl font-[600] text-zinc-600 max-h-[300px] min-h-[40px]",
        paragraph : "text-md text-zinc-500 max-h-[1000px] min-h-[35px]",
    }
    return (
        <textarea 
            rows={1}
            onChange={onChangeFn}
            value={value}
            maxLength={maxLength}
            className={`${styleAccordinVariant[variant]} p-1 focus:outline-none border-none bg-transparent w-full   focus:ring-[3px] transition duration-150 focus:ring-blue-300`}
            placeholder={placeholder} 
        >

        </textarea>
    );   
}