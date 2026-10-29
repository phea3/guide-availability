// import { getServerUri } from "@/lib/dev";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";

// const fetchData = async ({ data, token }: { data: any; token: string }) => {
//   const response = await axios({
//     url: `${getServerUri()}/api/register`,
//     method: "POST",
//     data,
//     timeout: 60000,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };

// export function useRegister() {
//   return useMutation({
//     mutationFn: fetchData,
//   });
// }

import { getServerUri } from "@/lib/dev";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async ({ data, token }: { data: any; token: string }) => {
  const url = `${getServerUri()}/api/register`;

  // console.log("Register request URL:", url);

  try {
    const response = await axios.post(url, data, {
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Status:", error.response?.status);
      console.log("Request URL:", error.config?.url);
      console.log("Response data:", error.response?.data);
      console.log("Response headers:", error.response?.headers);
    }

    throw error;
  }
};

export function useRegister() {
  return useMutation({
    mutationFn: fetchData,
  });
}
