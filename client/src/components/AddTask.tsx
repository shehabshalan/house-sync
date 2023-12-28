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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useCreateTask } from "@/services/useCreateTask";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";

const FREQUENCEY_OPTIONS = [
  {
    label: "Weekly",
    value: "WEEKLY",
  },
  {
    label: "Monthly",
    value: "MONTHLY",
  },
];

const AddTask = () => {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateTask();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState<Date>();

  const handleSubmit = () => {
    if (!name || !description || !frequency || !date) {
      toast({
        variant: "destructive",
        title: "One or more fields are empty",
        description: "Please fill out both fields.",
      });
      return;
    }

    // convert date to unix timestamp
    const unixDate = Math.floor(date.getTime() / 1000);

    mutate(
      {
        name,
        description,
        space_id: Number(id),
        start_date: unixDate,
        frequency,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          toast({
            variant: "default",
            title: "Space created",
          });
          queryClient.invalidateQueries({ queryKey: ["spaces", id] });
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
    console.log(name, description, frequency, unixDate, id);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new task</DialogTitle>
          <DialogDescription>
            Tasks represent the work that needs to be done by members of the
            space in a recurring fashion. You can choose the frequency of the
            task i.e weekly, monthly, etc. Members in this space will be
            automatically assigned to the task based on the frequency.
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
          <Select onValueChange={(value) => setFrequency(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Frequency</SelectLabel>
                {FREQUENCEY_OPTIONS.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick starting date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
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

export default AddTask;
