import { getServerUri } from "@/lib/dev";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (id: string) => {
  const res = await axios.post(
    `${getServerUri()}/api/delete-available-day`,
    { id },
    {
      timeout: 60000,
      headers: { "Content-Type": "application/json" },
    },
  );
  return res.data;
};

export function useDeleteAvailableDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/app-available-days"] });
    },
  });
}
