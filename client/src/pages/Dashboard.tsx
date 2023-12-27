import Layout from "@/components/Layout";
import { useGetUser } from "@/services/useGetUser";
import SpaceCard from "@/components/SpaceCard";
import { useGetSpaces } from "@/services/useGetSpaces";
import Loading from "@/components/Loading";
import { AddSpace } from "@/components/AddSpace";

const Dashboard = () => {
  const { data } = useGetUser();
  const { data: spaces, isLoading, isError } = useGetSpaces();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Layout user={data}>
      <div className="max-w-6xl w-full mx-auto flex items-center gap-4">
        <AddSpace />
      </div>
      {isError ? (
        <div>error loading spaces</div>
      ) : !spaces ? (
        <div>no spaces</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
          {spaces?.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
