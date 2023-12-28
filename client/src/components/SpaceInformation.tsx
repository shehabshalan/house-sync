import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import AddTask from "./AddTask";
import { Mail, TrashIcon } from "lucide-react";
import { ActionDialog } from "./ActionDialog";
import { useDeleteSpace } from "@/services/useDeleteSpace";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type SpaceInformationProps = {
  space: SpaceDetails | undefined;
};

const SpaceInformation = ({ space }: SpaceInformationProps) => {
  const { name, users, id } = space || {};
  const { mutate } = useDeleteSpace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const handleDelete = () => {
    console.log("Delete space", id);

    mutate(Number(id), {
      onSuccess: () => {
        toast({
          variant: "default",
          title: "Space Deleted",
        });
        queryClient.invalidateQueries({ queryKey: ["spaces"] });
        console.log("Space deleted");
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
          <ActionDialog
            title="Delete Space"
            description="Are you sure you want to delete this space?"
            onContinue={handleDelete}
            continueButtonText="Delete"
            cancelButtonText="Cancel"
          >
            <Button variant="destructive" size="icon" className="ml-auto">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </ActionDialog>
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
