import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
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
                  <TableCell className="font-medium">
                    {user.user_email}
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(user.due_date, "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell>
                    {user.is_completed ? (
                      <Button size="sm" variant="outline" disabled={true}>
                        Completed
                      </Button>
                    ) : (
                      <Button size="sm">Mark as Complete</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
