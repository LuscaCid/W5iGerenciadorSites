import { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ChangeEvent } from 'react';

interface InputProps
{
  id?: string;
  name?: string;
  placeholder?: string;
  icon?: LucideIcon;
  type?: string;
  className?: string;
  requiredInput? : boolean;
  disabled? : boolean;
  rest? : any[];
  min? : string;
  max? : string;
  maxLength?: number;
  minLength?: number;
  readonly? : boolean;
  buttonPasswordVisible? : boolean;
  label? : string;
  onChange : (e : ChangeEvent<HTMLInputElement>) => void;
  value : string|number;
}
export const Input = (
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
    label,
    onChange,
    value,
  }: InputProps) =>
{

  const patternStyle = `transition duration-200 py-2 group  px-14 pl-1 relative w-full ${type == "file"? "cursor-pointer hover:bg-zinc-300 transition duration-200  w-fit rounded-full p-3 flex items-center justify-center" :"rounded-lg  h-10" } mb-1  text-md  bg-zinc-200/60 dark:bg-zinc-800  placeholder:text-zinc-500  ${disabled ? "opacity-70 cursor-not-allowed" : ""}`;

  return (
    <fieldset className="flex flex-col gap-2 w-full">
      <label className="text-md " htmlFor={id} >
        { label }
      </label>
      <div className={twMerge([patternStyle, className ?? undefined])}>
        { Icon && <Icon size={20}  className="text-black ml-1 mt-0.5"/> }
        <input
          value={value}
          onChange={onChange}
          name={name}
          required={requiredInput}
          readOnly={readonly}
          maxLength={maxLength}
          minLength={minLength}
          min = {min}
          max = {max}
          {...rest}
          disabled = {disabled}
          autoComplete="off"
          id={id}
          placeholder={placeholder}
          className={` rounded-lg  ${type == 'file' ?  "sr-only w-10 ": "" } focus:outline-none bg-transparent absolute inset-0 focus:ring-blue-300 dark:focus:ring-blue-500 focus:ring-[4px] transition-all duration-150 ${Icon ? "px-8" : "px-3" }`}
          type={type}
        />
      </div>
    </fieldset>
  );
};

