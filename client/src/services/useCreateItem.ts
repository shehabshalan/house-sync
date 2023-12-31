import { API_ENDPOINTS } from "@/utils/endpoints";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

type ItemParams = {
  item: string;
  quantity: number;
  space_id: number;
};

const createItem = async (input: ItemParams): Promise<void> => {
  const { data } = await request.post(API_ENDPOINTS.SHOPPING_LIST, {
    item: input.item,
    quantity: input.quantity,
    space_id: input.space_id,
  });
  return data;
};

export const useCreateItem = () => {
  return useMutation({
    mutationFn: createItem,
  });
};
