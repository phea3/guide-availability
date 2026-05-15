import { getServerUri } from "@/lib/dev";
import { GuideType } from "@/types/guide";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (params?: Record<string, any>) => {
  const res = await axios({
    url: `${getServerUri()}/api/guide`,
    method: "GET",
    // headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params,
    timeout: 60000,
  }).then((res) => res.data);
  const data: GuideType[] = res?.data;
  return data;
};

export function useGetGuide() {
  const query = useQuery({
    queryFn: async () => {
      //   const token = await getToken({ skipCache: true });
      return fetchData();
    },
    queryKey: [`/app-guide`],
    // staleTime: 0,
    // enabled: !!userId,
  });
  //   const { isRefetchingByUser, refetchByUser } = useRefreshByUser(query.refetch);
  //   useRefreshOnFocus(query.refetch);

  //   return { ...query, isRefetchingByUser, refetchByUser };
  return { ...query };
}
