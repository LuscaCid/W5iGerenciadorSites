import {Tag} from "./Tag";
import {Image} from "./Image";
import {User} from "./User";
import {Paragraph} from "./Paragraph";

export interface Noticia
{
    id_noticia : number;
    ds_conteudo : string;
    nm_titulo : string;  
    ds_subtitulo : string;
    images : Image[]
    nu_dislike?: number;
    nu_like? : number;
    dt_publicacao? : string;
    dt_atualizacao? : string;
    url_thumbimg? : string;
    tags? : Array<Tag>
    usuario? : User;
    paragraphs : Paragraph[]
}
