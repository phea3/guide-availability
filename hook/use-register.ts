import { getServerUri } from "@/lib/dev";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async ({ data, token }: { data: any; token: string }) => {
  const response = await axios({
    url: `${getServerUri()}/api/register`,
    method: "POST",
    data,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export function useRegister() {
  return useMutation({
    mutationFn: fetchData,
  });
}
