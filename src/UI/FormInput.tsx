import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { useState } from "react";

interface InputProps<T extends string>
{
    id: string;
    name: T;
    placeholder?: string;
    icon?: LucideIcon;
    type?: string;
    className?: string;
    requiredInput? : string|boolean;
    disabled? : boolean;
    rest? : any[];
    min? : string;
    max? : string;
    maxLength?: number;
    minLength?: number;
    readonly? : boolean;
    buttonPasswordVisible? : boolean;
    label? : string;
}
// todos os inputs da aplicação serão "abraçados" pelo ...register("<input_name>") do react-hook-form
export const HookFormInput = <T extends string>(
    {
        id,
        icon: Icon, 
        name, 
        placeholder, 
        type = "text", 
        className,
        requiredInput,
        disabled,
        min,
        max,
        rest,
        maxLength,
        minLength,
        readonly,
        buttonPasswordVisible,
        label
    }: InputProps<T>) => 
{
    const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false);
    const handleTurnPasswordVisible = () => {
        setPasswordVisible(!passwordVisible);
    };
    const { register, formState: { errors } } = useFormContext();

    const patternStyle = `dark:bg-zinc-700 dark:text-zinc-100 transition duration-200 py-2 group  px-14 pl-1 relative w-full ${type == "file"? "cursor-pointer hover:bg-zinc-300 transition duration-200  w-fit rounded-md p-3 flex items-center justify-center" :"rounded-md  h-10" } mb-1  text-md  bg-zinc-200/60  placeholder:text-zinc-500  ${disabled ? "opacity-70 cursor-not-allowed" : ""}`;
    
    return ( 
        <fieldset className="flex flex-col gap-1 w-full">
            <label className="text-md dark:text-zinc-100 " htmlFor={id} >
                { label }
            </label>
            <div className={twMerge([patternStyle, className ?? undefined])}>
                { Icon && <Icon size={20}  className="text-black dark:text-white ml-1 mt-0.5"/> }
                <input
                    readOnly={readonly}
                    maxLength={maxLength}
                    minLength={minLength}
                    min = {min} 
                    max = {max} 
                    {...rest}
                    disabled = {disabled}
                    autoComplete="off"
                    {...register(name, { required : requiredInput, valueAsNumber : type === "number"},)}
                    id={id}
                    placeholder={placeholder}
                    className={`${errors ? "focus:outline-none w-full disabled:opacity-80 disabled:cursor-not-allowed " : "focus:outline-blue-400 dark:focus:outline-blue-600"} rounded-md  ${type == 'file' ?  "sr-only w-10 ": "" } bg-transparent absolute inset-0 focus:ring-blue-300 dark:focus:ring-blue-600 focus:ring-[4px] transition-all duration-150 ${Icon ? "px-8" : "px-3" }`}
                    type={type === "password" ? passwordVisible ? "text" : "password" : type }
                />
                {
                    buttonPasswordVisible && (
                        <Button 
                            onClick={handleTurnPasswordVisible}
                            className="w-fit p-0.5 rounded-full absolute right-2 top-2"
                            icon={passwordVisible ? Eye : EyeOff}
                        />
                    )
                }
                {
                    errors && (
                        <footer className="text-sm text-red-600 absolute top-[39px] left-0.5 font-semibold rounded-sm p-0.5  ">
                        {
                            errors[name]! && errors[name]!.message as unknown as string
                        }
                        </footer>
                    )
                }
            </div>
            
        </fieldset>
       
    );
};

