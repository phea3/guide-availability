import { getServerUri } from "@/lib/dev";
import { UserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (id: string) => {
  const res = await axios({
    url: `${getServerUri()}/api/user-id`,
    method: "GET",
    params: { id },
    timeout: 60000,
  }).then((res) => res.data);
  const data: UserType = res?.data;
  return data;
};

export function useGetUserById(id: string) {
  const query = useQuery({
    queryFn: async () => {
      return fetchData(id);
    },
    queryKey: [`/user-id`, id],
    enabled: !!id,
  });
  return { ...query };
}
