import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const useGetSpaceDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["spaces", id],
    queryFn: async (): Promise<SpaceDetails> => {
      const { data } = await request.get(`${API_ENDPOINTS.SPACES}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
