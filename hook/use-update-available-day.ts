import { getServerUri } from "@/lib/dev";
import { AvailableDraftTimeType } from "@/types/availability";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type UpdateAvailableDayModel = {
  id: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  remark?: string;
  status?: string;
  availableTimes?: AvailableDraftTimeType[];
};

const fetchData = async (data: UpdateAvailableDayModel) => {
  const res = await axios.post(
    `${getServerUri()}/api/update-available-day`,
    data,
    {
      timeout: 60000,
      headers: { "Content-Type": "application/json" },
    },
  );
  return res.data;
};

export function useUpdateAvailableDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/app-available-days"] });
    },
  });
}
