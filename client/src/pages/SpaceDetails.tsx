import SpaceActions from "@/components/SpaceActions";
import TaskCard from "@/components/TaskCard";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "react-router";
import { useGetSpaceDetails } from "@/services/useGetSpaceDetails";
import Loading from "@/components/Loading";

const SpaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: space, isLoading, isError } = useGetSpaceDetails(id);

  return (
    <DashboardLayout>
      {isError ? (
        <div>error loading space details</div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <>
          <SpaceActions space={space} />
          {space?.tasks?.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </>
      )}
    </DashboardLayout>
  );
};

export default SpaceDetails;
