import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const useGetSpaces = () => {
  return useQuery({
    queryKey: ["spaces"],
    queryFn: async (): Promise<Space[]> => {
      const { data } = await request.get(API_ENDPOINTS.SPACES);
      return data;
    },
  });
};
