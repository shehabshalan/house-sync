import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const useGetShoppingList = (id: string | undefined) => {
  return useQuery({
    queryKey: ["shoppingList", id],
    queryFn: async (): Promise<ShoppingItem[]> => {
      const { data } = await request.get(
        `${API_ENDPOINTS.SHOPPING_LIST}/${Number(id)}`
      );
      return data;
    },
    enabled: !!id,
  });
};
