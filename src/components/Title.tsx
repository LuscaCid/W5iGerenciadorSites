interface TitleProps {
    title: string;
    id : string;
}
export const Title = ({ title, id } : TitleProps) => {
    return (
        <h3
            id={id}
            className={"select-none text-2xl font-bold mb-1 mt-3 border-b-[4px] border-transparent hover:border-blue-500 transition duration-150 w-fit pb-2"}>
            {title}
        </h3>
    );
}