import { Slider } from "radix-ui";
import {useFormContext} from "react-hook-form";
interface Props<T extends string> {
    name : T
    step : number;
    max : number;
    id? : string;
}
export function SliderComponent <T extends string, >({ name, step, max, id } : Props<T>) {
    const { setValue, formState : { errors } } = useFormContext();
    return (
        <Slider.Root
            name={name}
            id={id}
            className="relative flex h-5 w-[200px] border border-zinc-100 dark:border-zinc-600 rounded-lg p-2 touch-none select-none items-center"
            step={step}
            max={max}
            onValueChange={(value) => setValue(name, (value[0] ).toString() as any)}
        >
            <Slider.Track className="relative h-[3px] grow rounded-full bg-blackA7">
                <Slider.Range className="absolute h-full rounded-full bg-zinc-200" />
            </Slider.Track>
            <Slider.Thumb
                className="block size-5 rounded-[10px] bg-blue-400 shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
                aria-label="Volume"
            />
            {
                errors && (
                    <span className={"mt-5 text-red-400"}>
                        {errors[name]! && errors[name]!.message as unknown as string}
                    </span>
                )
            }
        </Slider.Root>
    )
}


