interface NewsCardProps 
{
    img : string;
    title : string;
    content: string;
    date : string;
}
export function NewsCard (props : NewsCardProps) 
{
    return (
        <div className="rounded-none relative">
            <img src={props.img} />
            <h2 className="absolute top-2 left-2 text-2xl font-bold ">{props.title}</h2>
            <p>{props.content}</p>
            <p></p>
        </div>
    );
}