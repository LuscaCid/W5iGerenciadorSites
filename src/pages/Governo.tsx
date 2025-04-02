import {useQuery} from "@tanstack/react-query";
import {useUserContext} from "../store/user.ts";

export const Government = () => {
  // const { } = useQuery({})
  const user = useUserContext(state => state.user);

  return (
    <div>
      {user ? (
          <></>
      ) : (
          <></>
      )}
    </div>
  )
}