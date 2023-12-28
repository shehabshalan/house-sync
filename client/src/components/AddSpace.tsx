import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSpace } from "@/services/useCreateSpace";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";

const AddSpace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateSpace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name || !description) {
      toast({
        variant: "destructive",
        title: "One or more fields are empty",
        description: "Please fill out both fields.",
      });
      return;
    }

    mutate(
      { name, description },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          toast({
            variant: "default",
            title: "Space created",
          });
          queryClient.invalidateQueries({ queryKey: ["spaces"] });
          document.getElementById("closeDialog")?.click();
        },
        onError: (e: Error & { response?: any }) => {
          toast({
            variant: "destructive",
            title: e.response?.data?.detail || "An error occurred",
            description: "There was a problem with your request. Try again.",
          });
        },
      }
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Space</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new space</DialogTitle>
          <DialogDescription>
            Spaces are where your housemates can create or track tasks and
            shipping lists. You can create as many as you like.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              className="col-span-6"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              className="col-span-6"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" variant="outline" id="closeDialog">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isPending}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpace;
