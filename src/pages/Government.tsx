import {useUserContext} from "../store/user.ts";
import {GovernmentAdmin} from "../components/GovermentAdmin.tsx";
import {useGovernment} from "../hooks/useGovernment.ts";
import {useQuery} from "@tanstack/react-query";
import {GovernmentClient} from "../components/GovernmentClient.tsx";

export const Government = () => {
  const user = useUserContext(state => state.user);
  const { getSiteGovernmentData } = useGovernment();

  const { data } = useQuery({
    queryFn : async () => getSiteGovernmentData(),
    queryKey : ["government"]
  })

  return (
    <div>
      {user ? (
        <GovernmentAdmin governmentData={data}/>
      ) : data && (
        <GovernmentClient govData={data}/>
      )}
    </div>
  )
}