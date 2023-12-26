import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { HomeIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Badge } from "./ui/badge";

const SpaceCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <HomeIcon className="w-8 h-8" />
        <div className="grid gap-1">
          <CardTitle>Space 1</CardTitle>
          <CardDescription>100 Members</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Avatar>
          <AvatarImage alt="@jaredpalmer" src="/placeholder-avatar.jpg" />
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
        {/* <Badge>Active</Badge> */}
      </CardContent>
    </Card>
  );
};

export default SpaceCard;
