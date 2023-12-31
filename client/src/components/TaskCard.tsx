import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { useGetUser } from "@/services/useGetUser";
import TaskMembersTable from "./TaskMembersTable";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const { data: currentUser } = useGetUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TaskMembersTable task={task} currentUser={currentUser} />
      </CardContent>
    </Card>
  );
};

export default TaskCard;
