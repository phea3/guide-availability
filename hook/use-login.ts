import { getServerUri } from "@/lib/dev";
import { LoginType } from "@/types/register";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (data: LoginType) => {
  const response = await axios({
    url: `${getServerUri()}/api/login`,
    method: "POST",
    data: data,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export function useLogin() {
  return useMutation({
    mutationFn: fetchData,
  });
}
