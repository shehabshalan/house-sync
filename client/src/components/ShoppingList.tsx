import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useGetUser } from "@/services/useGetUser";
import { useGetShoppingList } from "@/services/useGetShoppingList";
import Loading from "./Loading";
import AddItem from "./AddItem";
import { useUpdateItemStatus } from "@/services/useUpdateItemStatus";

const ShoppingList = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: currentUser } = useGetUser();
  const { mutate, isPending } = useUpdateItemStatus();
  const { data: shoppingList, isLoading } = useGetShoppingList(id);
  const queryClient = useQueryClient();

  const handleUpdateStatus = (data: ShoppingItem) => {
    if (!currentUser) return;

    const payload = {
      id: data.id,
      is_purchased: true,
      purchased_by: currentUser.email,
    };

    mutate(payload, {
      onSuccess: () => {
        toast({
          variant: "default",
          title: "Marked as purchased",
        });
        queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
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

  if (isLoading) return <Loading />;
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Shopping List</CardTitle>
          <AddItem />
        </div>
        <CardDescription>
          These are missing items that are added by space members or you. You
          can do this by clicking on the "Add Item" button.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Purchased by</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoppingList &&
              shoppingList.length > 0 &&
              shoppingList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="font-medium">{item.quantity}</TableCell>
                  <TableCell className="font-medium">
                    {item.is_purchased ? item.purchased_by : "Not purchased"}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(item)}
                      disabled={isPending || item.is_purchased}
                    >
                      {item.is_purchased ? "Purchased" : "Mark as purchased"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShoppingList;
