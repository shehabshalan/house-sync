import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useGetUser } from "@/services/useGetUser";
import SpaceCard from "@/components/SpaceCard";

const Dashboard = () => {
  const { data } = useGetUser();
  return (
    <Layout user={data}>
      <div className="max-w-6xl w-full mx-auto flex items-center gap-4">
        <Button>Add New Space</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
        <SpaceCard />
      </div>
    </Layout>
  );
};

export default Dashboard;
