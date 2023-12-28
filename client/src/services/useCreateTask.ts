import { API_ENDPOINTS } from "@/utils/endpoints";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

type TaskParams = {
  name: string;
  description: string;
  space_id: number;
  start_date: number;
  frequency: string;
};

const createTask = async (input: TaskParams): Promise<void> => {
  const { data } = await request.post(API_ENDPOINTS.TASKS, {
    name: input.name,
    description: input.description,
    space_id: input.space_id,
    start_date: input.start_date,
    frequency: input.frequency,
  });
  return data;
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: createTask,
  });
};
