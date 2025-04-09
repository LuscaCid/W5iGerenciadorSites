import {Image} from "./Image";
import {SecretariatDepartment} from "./SecretariatDepartment";
import {User} from "./User";
import {Site} from "./Site";

export interface Secretariat
{
    id_secretariat? : number;
    nm_secretariat : string;
    nm_secretary : string;
    ds_about : string;
    nm_email : string;
    nu_phone : string;
    ds_address : string;
    user : User;
    site : Site
    secretariatDepartments : SecretariatDepartment[];
    secretariatImage : Image;
    organizationalChart? : Image;
}