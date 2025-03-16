import {Tag} from "./Tag";
import {Image} from "./Image";

export interface Noticia
{

    id_noticia : number;
    ds_conteudo : string;
    nm_titulo : string;  
    ds_subtitulo : string;
    dt_publicacao : string;
    dt_atualizacao? : string;
    url_thumbimg? : string;
    tags? : Array<Tag>
    images : Image[]
}
