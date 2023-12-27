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

export function AddSpace() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateSpace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name || !description) {
      toast({
        variant: "destructive",
        title: "Name and description are required",
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
            Spaces are where your housemates can track tasks and shipping lists.
            You can create as many as you like.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              className="col-span-3"
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
}
