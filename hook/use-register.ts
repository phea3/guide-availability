import { getServerUri } from "@/lib/dev";
import { RegisterType } from "@/types/register";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (data: RegisterType) => {
  const response = await axios({
    url: `${getServerUri()}/api/register`,
    method: "POST",
    data: data,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export function useRegister() {
  return useMutation({
    mutationFn: fetchData,
  });
}
