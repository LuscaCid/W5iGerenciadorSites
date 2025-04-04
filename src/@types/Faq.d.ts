import {Site} from "./Site";
import {User} from "./User";
export enum Level {
    Baixo = 1,
    Medio = 2,
    Alto = 3
}
export interface Faq {
    id_faq : number;
    ds_questao : string;
    ds_resposta : string;
    user : User;
    nu_nivel : Level;
    site : Site;
}