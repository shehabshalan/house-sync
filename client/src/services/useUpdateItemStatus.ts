import { API_ENDPOINTS } from "@/utils/endpoints";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

type ShoppingItemParams = {
  id: number;
  is_purchased: boolean;
  purchased_by: string;
};

const updateItemStatus = async (input: ShoppingItemParams): Promise<void> => {
  const ITEM_STATUS_PATH = `${API_ENDPOINTS.SHOPPING_ITEM_STATUS.replace(
    "id",
    input.id.toString()
  )}`;
  return await request.put(ITEM_STATUS_PATH, {
    is_purchased: input.is_purchased,
    purchased_by: input.purchased_by,
  });
};

export const useUpdateItemStatus = () => {
  return useMutation({
    mutationFn: updateItemStatus,
  });
};
