import DefaultUser from "/user.png";
interface  Props {
    title : string;
    clickable? : boolean;
    subtitle? : string;
}
export const UserAvatar = ({ title, clickable = true, subtitle } : Props) => {
    return (
        <div
            className={`flex items-center gap-2 ${clickable ? "cursor-pointer" : "cursor-default"}`}
        >
            <main
                className='rounded-full h-12 w-12 hover:ring-[6px] outline-3 outline-zinc-50 contain-content shadow-lg hover:ring-blue-500 transition duration-150  flex items-center justify-center bg-zinc-50'
            >
                <img src={DefaultUser} alt="Imagem do usuário"/>
            </main>
            <span className='hidden  md:flex flex-col  select-none hover:underline'>
                {title}
            </span>
            {
                subtitle && (
                    <span className={"text-sm text-zinc-500"}>
                        {subtitle}
                    </span>
                )
            }
        </div>
    );
}
