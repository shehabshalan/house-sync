import { API_ENDPOINTS } from "@/utils/endpoints";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

type InviteParams = {
  emails: string[];
  space_id: number;
};

const createInvites = async (input: InviteParams): Promise<void> => {
  const { data } = await request.post(API_ENDPOINTS.SPACE_INVITE, {
    emails: input.emails,
    space_id: input.space_id,
  });
  return data;
};

export const useCreateInvites = () => {
  return useMutation({
    mutationFn: createInvites,
  });
};
