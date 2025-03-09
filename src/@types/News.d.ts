export interface Noticia 
{
    id_noticia : number;
    ds_conteudo : string;
    nm_titulo : string;  
    ds_subtitulo : string;
    dt_publicacao : string;
    nm_img? : string;
    tags? : Array<Tag>
}

export interface Tag 
{
    nm_slug : string;
    dt_cadastro : string;
}