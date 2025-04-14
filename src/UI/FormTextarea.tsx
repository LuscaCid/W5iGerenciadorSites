import {useFormContext} from "react-hook-form";
import {twMerge} from "tailwind-merge";
interface Props <T extends string> {
    name : T
    id : string;
    className? : string;
    label? : string;
    placeholder? : string;
}
export function FormTextarea  <T extends string>({name, id, className, label, placeholder} : Props<T>) {
    const {register} = useFormContext()
    return (
        <fieldset className={"flex flex-col gap-1 w-full"}>
            {label && <label htmlFor={id} className={"text-md dark:text-zinc-100"}>{label}</label>}
            <textarea
                {...register(name)}
                id={id}
                placeholder={placeholder}
                rows={3}
                className={twMerge(["rounded-lg bg-zinc-200/60 min-h-[60px] max-h-[250px] dark:bg-zinc-700/60 dark:text-zinc-100 resize-x-none p-3 focus:outline-none focus:ring-[4px] focus:ring-blue-300 dark:focus:ring-blue-600  transition duration-150"], [className])}
            >
            </textarea>
        </fieldset>
    )
}