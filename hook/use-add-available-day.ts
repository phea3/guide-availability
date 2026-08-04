import { getServerUri } from "@/lib/dev";
import { AvailableDayType } from "@/types/availability";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AvailableTimeModel } from "./use-update-available-day";

export type AvailableDayModel = Omit<AvailableDayType, "id"> & {
  availableTimes?: AvailableTimeModel[];
};

const fetchData = async (data: AvailableDayModel) => {
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/app-available-days"] });
    },
  });
}
