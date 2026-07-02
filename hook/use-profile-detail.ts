import { getServerUri } from "@/lib/dev";
import { ProfileDetailType } from "@/types/register";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (data: ProfileDetailType) => {
  const response = await axios({
    url: `${getServerUri()}/api/profile-detail`,
    method: "POST",
    data: data,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export function useProfileDetail() {
  return useMutation({
    mutationFn: fetchData,
  });
}
