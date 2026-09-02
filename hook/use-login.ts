import { getServerUri } from "@/lib/dev";
import { LoginType } from "@/types/register";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type LoginRequest = {
  token: string;
  data: LoginType;
};

const fetchData = async ({ token, data }: LoginRequest) => {
  const response = await axios({
    url: `${getServerUri()}/api/login`,
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

export function useLogin() {
  return useMutation({
    mutationFn: fetchData,
  });
}
