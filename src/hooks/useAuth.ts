import {useCallback} from "react";
import {api} from "../services/api.ts";
import {FormSchemaType} from "../pages/AdminLogin.tsx";
import {User} from "../@types/User";
export interface SignInDTO {
    nm_email : string;
    nm_senha: string;
}
export interface SignInReturn { access_token: string, user : Partial<User> }
export const useAuth = () => {
    const PATH_NAME = "auth" ;

    const signIn = useCallback(async(payload : FormSchemaType) => {
        const response = await api.post(`${PATH_NAME}/signin`, payload);
        return response.data as SignInReturn;
    }, [])

    const requestPassword = useCallback(async(payload : Pick<SignInDTO, "nm_email">) => {
        const response = await api.post(`${PATH_NAME}/requestpassword`, payload);
        return response.data;
    }, [])
    return {
        signIn,
        requestPassword
    }
}