import {Site} from "./Site";
import {Image} from "./Image";

export interface Government
{
    id_governo?: number;
    nm_prefeito : string;
    ds_sobreprefeito : string;
    ds_enderecoprefeito : string;
    nu_telefoneprefeito : string;
    nm_emailprefeito : string;
    nm_viceprefeito : string;
    ds_sobreviceprefeito : string;
    ds_enderecoviceprefeito : string;
    nu_telefoneviceprefeito : string;
    nm_emailviceprefeito : string;
    site : Site;
    mayorImage : Image;
    deputyMayorImage : Image;
    organizationalChart : Image;
}