import {twMerge} from "tailwind-merge";
import {useFormContext} from "react-hook-form";

type Variant = "title" | "subtitle" | "paragraph"
interface Props<T extends string>
{
    name : T,
    variant : Variant;
    placeholder : string;
    type? : string;
    maxLength? : number;
    className? : string;
    rest? : any[]
}
export function HookFormTextarea <T extends string>(
    {
        name,
        placeholder,
        variant,
        maxLength,
        className,
        ...rest
    } : Props<T>){
    const { register } = useFormContext();
    const styleAccordingVariant : Record<Variant, string> = {
        title : "font-[700] text-4xl text-zinc-800 max-h-[230px] min-h-[50px] dark:text-zinc-500",
        subtitle : "text-2xl font-[600] text-zinc-600 max-h-[300px] min-h-[40px] dark:text-zinc-400",
        paragraph : "text-md text-zinc-500 max-h-[1000px] min-h-[35px] dark:text-zinc-50",
    }
    return (
        <textarea
            {...register(name)}
            {...rest}
            rows={variant == "paragraph" ? 5 : 1}
            maxLength={maxLength}
            className={twMerge([`${styleAccordingVariant[variant]} p-1 focus:outline-none border-none bg-transparent w-full   focus:ring-[3px] transition duration-150 focus:ring-blue-300 dark:focus:ring-blue-500`], [className]) }
            placeholder={placeholder}
        >
        </textarea>
    );
}