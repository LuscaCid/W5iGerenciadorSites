import { ChangeEvent } from "react";
import {twMerge} from "tailwind-merge";

type Variant = "title" | "subtitle" | "paragraph"
interface Props 
{
    value : string;
    onChangeFn : (e : ChangeEvent<HTMLTextAreaElement>) => void;
    variant : Variant;
    placeholder : string;
    type? : string;
    maxLength? : number;
    className? : string;
    rest? : any[]
}
export const NewsDetailInput = (
{ 
    placeholder, 
    variant, 
    maxLength, 
    onChangeFn, 
    value,
    className,
    rest
} : Props) => 
{
    const styleAccordinVariant : Record<Variant, string> = {
        title : "font-[700] text-4xl text-zinc-800 max-h-[230px] min-h-[50px] dark:text-zinc-400",
        subtitle : "text-2xl font-[600] text-zinc-600 max-h-[300px] min-h-[40px] dark:text-zinc-500",
        paragraph : "text-md text-zinc-500 max-h-[1000px] min-h-[35px] dark:text-zinc-500",
    }
    return (
        <textarea
            {...rest}
            rows={variant == "paragraph" ? 5 : 1}
            onChange={onChangeFn}
            value={value}
            maxLength={maxLength}
            className={twMerge([`${styleAccordinVariant[variant]} p-1 focus:outline-none border-none bg-transparent w-full   focus:ring-[3px] transition duration-150 focus:ring-blue-300`], [className]) }
            placeholder={placeholder} 
        >

        </textarea>
    );   
}