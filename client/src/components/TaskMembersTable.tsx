import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { useParams } from "react-router";
import { useToast } from "./ui/use-toast";
import { useUpdateTaskStatus } from "@/services/useUpdateTaskStatus";
import { useQueryClient } from "@tanstack/react-query";

type TaskMembersTableProps = {
  task: Task;
  currentUser?: User;
};
const TaskMembersTable = ({ task, currentUser }: TaskMembersTableProps) => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateTaskStatus();
  const queryClient = useQueryClient();

  const handleUpdateStatus = () => {
    mutate(task.id, {
      onSuccess: () => {
        toast({
          variant: "default",
          title: "Marked as complete",
        });
        queryClient.invalidateQueries({ queryKey: ["spaces", id] });
      },
      onError: (e: Error & { response?: any }) => {
        toast({
          variant: "destructive",
          title: e.response?.data?.detail || "An error occurred",
          description: "There was a problem with your request. Try again.",
        });
      },
    });
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {task.users.length > 0 &&
          task.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.user_email}</TableCell>
              <TableCell className="font-medium">
                {user.due_date !== null
                  ? format(new Date(user.due_date), "MM/dd/yyyy")
                  : "Starts next cycle"}
              </TableCell>
              <TableCell>
                {user.is_completed || user.due_date == null ? (
                  <Button size="sm" variant="outline" disabled={true}>
                    {user.due_date !== null ? "Completed" : "Not started"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleUpdateStatus}
                    disabled={
                      isPending || currentUser?.email !== user.user_email
                    }
                  >
                    Mark as Complete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TaskMembersTable;
