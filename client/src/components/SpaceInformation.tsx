import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SpaceInformation = () => {
  return (
    <Card>
      <CardHeader className="flex justify-between flex-row">
        <CardTitle>Space Name</CardTitle>
        <Button size="sm" variant="outline">
          Edit Space
        </Button>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center -space-x-1">
          <Avatar>
            <AvatarImage alt="Member 1" src="/placeholder-avatar.jpg" />
            <AvatarFallback>M1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage alt="Member 2" src="/placeholder-avatar.jpg" />
            <AvatarFallback>M2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage alt="Member 3" src="/placeholder-avatar.jpg" />
            <AvatarFallback>M3</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpaceInformation;
