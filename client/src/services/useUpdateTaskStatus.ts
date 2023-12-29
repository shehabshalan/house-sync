import { API_ENDPOINTS } from "@/utils/endpoints";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

const updateTaskStatus = async (id: string): Promise<void> => {
  const TASKS_STATUS_PATH = `${API_ENDPOINTS.TASKS_STATUS.replace("id", id)}`;
  return await request.put(TASKS_STATUS_PATH);
};

export const useUpdateTaskStatus = () => {
  return useMutation({
    mutationFn: updateTaskStatus,
  });
};
