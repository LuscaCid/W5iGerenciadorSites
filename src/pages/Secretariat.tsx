import {useParams} from "react-router-dom";
import {memo} from "react";
import {useQuery} from "@tanstack/react-query";
import {useSecretariat} from "../hooks/useSecretariat.ts";

export const Secretariat = memo(() => {
    const params = useParams();
    const { getSecretariats, deleteSecretariat, addSecretariat } = useSecretariat();
    const data = useQuery({
        queryFn : async () => await getSecretariats(),
        queryKey : ["get-secretariat"],
        refetchOnWindowFocus : false,

    })
    return (
        <section>
            Secretarias
        </section>
    )
})