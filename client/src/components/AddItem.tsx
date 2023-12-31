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
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateItem } from "@/services/useCreateItem";
import { useParams } from "react-router";

const AddItem = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateItem();
  const [form, setForm] = useState({
    item: "",
    quantity: "",
  });

  const handleSubmit = () => {
    if (!form.item || !form.quantity) {
      toast({
        variant: "destructive",
        title: "One or more fields are empty",
        description: "Please fill out both fields.",
      });
      return;
    }

    const payload = {
      item: form.item,
      quantity: Number(form.quantity),
      space_id: Number(id),
    };

    mutate(payload, {
      onSuccess: () => {
        setForm({
          item: "",
          quantity: "",
        });
        toast({
          variant: "default",
          title: "Item added",
        });
        queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
        document.getElementById("closeDialog")?.click();
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
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new item</DialogTitle>
          <DialogDescription>
            Add a new item to your shopping list. Spaces members will be able to
            see this item and buy it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-name" className="text-left">
              Item name
            </Label>
            <Input
              id="item-name"
              value={form.item}
              className="col-span-6"
              onChange={(e) => setForm({ ...form, item: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-left">
              Quantity
            </Label>
            <Input
              id="quantity"
              value={form.quantity}
              className="col-span-6"
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              type="number"
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
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;
