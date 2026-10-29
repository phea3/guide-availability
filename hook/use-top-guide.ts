import { getServerUri } from "@/lib/dev";
import { UserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (params?: Record<string, any>) => {
  const res = await axios({
    url: `${getServerUri()}/api/top-guide`,
    method: "GET",
    params,
    timeout: 60000,
  }).then((res) => res.data);
  const data: (UserType & {
    availableDaysCount?: number;
  })[] = res?.data;
  return data;
};

export function useTopGuide() {
  const query = useQuery({
    queryFn: async () => {
      return fetchData();
    },
    queryKey: [`/top-guide`],
  });

  return { ...query };
}
