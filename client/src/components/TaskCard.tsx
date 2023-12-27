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

const TaskCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chore Tasks</CardTitle>
        <CardDescription>
          A list of tasks that need to be completed by the assigned members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Names</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Clean Kitchen</TableCell>
              <TableCell>12/31/2023</TableCell>
              <TableCell>
                <Button size="sm">Mark as Complete</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Buy Groceries</TableCell>
              <TableCell>12/30/2023</TableCell>
              <TableCell>
                <Button size="sm">Mark as Complete</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
