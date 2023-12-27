import { CardTitle, CardHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SpaceInformation from "@/components/SpaceInformation";
import TaskCard from "@/components/TaskCard";
import DashboardLayout from "@/components/DashboardLayout";

const SpaceDetails = () => {
  return (
    <DashboardLayout>
      <SpaceInformation />
      <Card>
        <CardHeader className="flex justify-between flex-row">
          <CardTitle>Tasks</CardTitle>
          <Button size="sm">Create Task</Button>
        </CardHeader>
      </Card>
      <TaskCard />
    </DashboardLayout>
  );
};

export default SpaceDetails;
