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
import { useParams } from "react-router";
import { useCreateInvites } from "@/services/useCreateInvites";
import { Command, Mail } from "lucide-react";
import { Badge } from "./ui/badge";

const InviteUser = () => {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateInvites();
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  const handlSpace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedEmail = e.target.value.replace(/\s/g, ""); // Remove spaces from email
    setEmail(trimmedEmail);
  };

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(e.currentTarget.value)) {
        toast({
          variant: "destructive",
          title: "Invalid email address",
          description: "Please enter a valid email address.",
        });
        return;
      }

      setEmails([...emails, e.currentTarget.value]);
      setEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleSubmit = () => {
    if (emails.length === 0) {
      toast({
        variant: "destructive",
        title: "You must enter at least one email address",
        description: "Please fill out both fields.",
      });
      return;
    }

    mutate(
      {
        emails: emails,
        space_id: Number(id),
      },
      {
        onSuccess: () => {
          setEmails([]);
          toast({
            variant: "default",
            title: "Invites sent!",
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
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Mail className="mr-2 h-4 w-4" /> Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite users to your space!</DialogTitle>
          <DialogDescription>
            Invite users to your space by entering their email addresses below.
            Hit <b>Enter</b>{" "}
            <span className="inline-flex items-center align-middle">
              <Command className=" h-4 w-4" />
            </span>{" "}
            to add a new email address to the list, and click <b>submit</b> to
            send the invites!
            <br />
            <br />
            <b>Note:</b> You can remove an email address by clicking on it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Email
            </Label>
            <Input
              id="name"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handlSpace}
              onKeyDown={handleAddEmail}
              className="col-span-6"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {emails.map((email) => (
              <Badge key={email} onClick={() => handleRemoveEmail(email)}>
                {email}
              </Badge>
            ))}
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

export default InviteUser;
