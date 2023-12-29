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
import { Command, Mail, PlusIcon, UserIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useGetSpaces } from "@/services/useGetSpaces";
import { useGetUser } from "@/services/useGetUser";
import { ScrollArea } from "./ui/scroll-area";

const InviteUser = () => {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { data: spaces } = useGetSpaces();
  const { data: curretUser } = useGetUser();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateInvites();
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  // Get all users from all spaces except the current user
  const users = spaces?.map((space) => space.users.map((user) => user.email));
  const allUsers = users?.flat();
  const allUsersUnique = [...new Set(allUsers)].filter(
    (user) => user !== curretUser?.email
  );

  const handlSpace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedEmail = e.target.value.replace(/\s/g, ""); // Remove spaces from email
    setEmail(trimmedEmail);
  };

  const validateUserEntry = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email address",
        description: "Please enter a valid email address.",
      });
      return false;
    }

    if (emails.includes(email)) {
      toast({
        variant: "destructive",
        title: "Duplicate email address",
        description: "Please enter a unique email address.",
      });
      return false;
    }

    return true;
  };

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      const isValid = validateUserEntry(e.currentTarget.value);
      if (!isValid) return;
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
            <span className="mt-1">
              <b>Note:</b> You can remove an email address by clicking on it.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
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
          {allUsersUnique?.length > 0 ? (
            <>
              <Label htmlFor="name" className="text-left -mt-2">
                Or select from existing users
              </Label>
              <ScrollArea className="max-h-52">
                {allUsersUnique?.map((user) => (
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <UserIcon />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{user}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        const isValid = validateUserEntry(user);
                        if (!isValid) return;
                        setEmails([...emails, user]);
                      }}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </>
          ) : null}
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
