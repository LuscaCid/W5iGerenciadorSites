import { Tooltip } from "@mui/material";
import * as Switcher from "@radix-ui/react-switch";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface ISwitchProps<T extends string>
{
    name : T;
    description? : string;
    label? : string;
    className? : string;
    rootClassname? : string;
    thumbClassname? : string;
    defaultValue? : boolean;
    disabled? : boolean;
    flexCol? : boolean;
    render? : boolean;
}
export function Switch <T extends string, >(
    {
        label,
        description,
        name,
        className,
        rootClassname,
        defaultValue,
        thumbClassname ,
        disabled,
        flexCol,
        render = true
    } : ISwitchProps<T>)
{
    const { register, setValue } = useFormContext();

    if (render) return (
        <Tooltip
            enterDelay={500}
            enterNextDelay={400}
            title={description}
        >
            <section
                className={twMerge([`flex ${flexCol ? "flex-col" : "flex-row items-center"}  gap-2 `, className])}
            >
                <label
                    className="text-md font-semibold  text-zinc-900"
                    htmlFor={name}>
                    {label}
                </label>
                <Switcher.Root
                    disabled = {disabled}
                    checked = {defaultValue}
                    onCheckedChange={(checked) => {
                        setValue(name, checked as any)
                    }}
                    {...register(name)}
                    className={twMerge(["w-[42px] h-[25px] disabled:cursor-not-allowed disabled:opacity-80  bg-zinc-300 rounded-full relative focus:shadow-[0_0_0_2px]   focus:shadow-black transition-colors duration-1 outline-none cursor-default", rootClassname])}
                    id={name}
                >
                    <Switcher.Thumb
                        className={twMerge(["block w-[21px] h-[21px] bg-white rounded-full  shadow-blackA4 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-green-600 transition duration-200", thumbClassname]) } />
                </Switcher.Root>
            </section>
        </Tooltip>


    );
}