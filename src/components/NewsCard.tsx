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
        <div className="news-card">
            <img src="" alt="" />
            <h2>News Title</h2>
            <p>News Description</p>
            <p>Posted on: January 1, 2022</p>
        </div>
    );
}