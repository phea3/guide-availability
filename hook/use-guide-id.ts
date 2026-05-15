import { getServerUri } from "@/lib/dev";
import { GuideType } from "@/types/guide";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (id: string) => {
  const res = await axios({
    url: `${getServerUri()}/api/guide-id`,
    method: "GET",
    params: { id },
    timeout: 60000,
  }).then((res) => res.data);
  const data: GuideType = res?.data;
  return data;
};

export function useGetGuideById(id: string) {
  const query = useQuery({
    queryFn: async () => {
      return fetchData(id);
    },
    queryKey: [`/guide-id`, id],
    enabled: !!id,
  });
  return { ...query };
}
