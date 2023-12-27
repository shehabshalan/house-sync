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

const SpaceCard = ({ space }: { space: Space }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <HomeIcon className="w-8 h-8" />
        <div className="grid gap-1">
          <CardTitle>{space.name}</CardTitle>
          <CardDescription>{space.users.length} Members</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        {space.users.slice(0, 5).map((user) => (
          <Avatar key={user.id}>
            <AvatarImage
              alt={user.name}
              src={user.picture || "/placeholder-avatar.jpg"}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        ))}
        {/* <Badge>Active</Badge> */}
      </CardContent>
    </Card>
  );
};

export default SpaceCard;
