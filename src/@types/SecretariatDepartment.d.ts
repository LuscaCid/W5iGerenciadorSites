import {Secretariat} from "./Secretariat";
import {Site} from "./Site";

export interface SecretariatDepartment
{
    id_department? : string;
    nm_department : string;
    ds_about : string;
    nm_email : string;
    nu_phone : string;
    ds_address : string;
    ds_attributions : string;
    secretariat : Secretariat
    site : Site
}