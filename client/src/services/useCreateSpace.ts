import { API_ENDPOINTS } from "@/utils/endpoints";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

type SpaceParams = {
  name: string;
  description: string;
};

const createSpace = async (input: SpaceParams): Promise<void> => {
  const { data } = await request.post(API_ENDPOINTS.SPACES, {
    name: input.name,
    description: input.description,
  });
  return data;
};

export const useCreateSpace = () => {
  return useMutation({
    mutationFn: createSpace,
  });
};
