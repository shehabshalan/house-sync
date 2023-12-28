import { API_ENDPOINTS } from "@/utils/endpoints";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

const deleteSpace = async (id: number): Promise<void> => {
  return await request.delete(`${API_ENDPOINTS.SPACES}/${id}`);
};

export const useDeleteSpace = () => {
  return useMutation({
    mutationFn: deleteSpace,
  });
};
