import {AxiosError} from "axios";

export const getAxiosErrorMessage = (err : AxiosError) => {
    if (err instanceof AxiosError && err.response)
        return (err.response.data as { message : string }).message;
}