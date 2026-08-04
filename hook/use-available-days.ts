import { getServerUri } from "@/lib/dev";
import { AvailableDayType, AvailableTimeType } from "@/types/availability";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (params?: Record<string, any>) => {
  const res = await axios({
    url: `${getServerUri()}/api/available-days`,
    method: "GET",
    params,
    timeout: 60000,
  }).then((res) => res.data);
  const data: (AvailableDayType & { availableTimes?: AvailableTimeType[] })[] =
    res?.data;
  return data;
};

export function useGetAvailableDays() {
  const query = useQuery({
    queryFn: async () => {
      return fetchData();
    },
    queryKey: [`/app-available-days`],
  });
  return { ...query };
}
