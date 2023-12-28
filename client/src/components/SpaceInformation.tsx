import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import AddTask from "./AddTask";
import { Mail } from "lucide-react";

type SpaceInformationProps = {
  space: SpaceDetails | undefined;
};

const SpaceInformation = ({ space }: SpaceInformationProps) => {
  const { name, users } = space || {};
  return (
    <Card>
      <CardHeader className="flex justify-between flex-row">
        <CardTitle>{name}</CardTitle>
        <div className="flex flex-col  gap-4 md:flex-row md:items-center md:gap-2">
          <Button size="sm" variant="outline">
            Edit Space
          </Button>
          <Button size="sm" variant="secondary">
            <Mail className="mr-2 h-4 w-4" /> Invite Members
          </Button>
          <AddTask />
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center -space-x-1">
          {users?.slice(0, 5).map((user) => (
            <Avatar key={user.email}>
              <AvatarImage
                alt={user.name}
                src={user.picture || "/placeholder-avatar.jpg"}
              />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpaceInformation;
