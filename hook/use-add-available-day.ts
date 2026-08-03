import { getServerUri } from "@/lib/dev";
import { AvailableDayType } from "@/types/availability";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (data: AvailableDayType) => {
  const response = await axios({
    url: `${getServerUri()}/api/add-available-day`,
    method: "POST",
    data: data,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export function useAddAvailableDay() {
  return useMutation({
    mutationFn: fetchData,
  });
}
