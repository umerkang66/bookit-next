import { useSession } from "next-auth/react";

export function useUser() {
  const { data, status } = useSession();
  const user = data?.user;
  return { user, status };
}
