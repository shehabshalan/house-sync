import AddSpace from "@/components/AddSpace";
import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";
import SpaceCard from "@/components/SpaceCard";
import { useGetSpaces } from "@/services/useGetSpaces";

const Spaces = () => {
  const { data: spaces, isLoading, isError } = useGetSpaces();

  return (
    <DashboardLayout>
      <div className="max-w-6xl w-full mx-auto flex items-center gap-4">
        <AddSpace />
      </div>
      {isError ? (
        <div>error loading spaces</div>
      ) : spaces?.length === 0 ? (
        <div>no spaces</div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
          {spaces?.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Spaces;
