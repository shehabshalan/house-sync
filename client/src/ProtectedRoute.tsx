import { ReactNode } from "react";
import { useGetUser } from "./services/useGetUser";
import { useNavigate } from "react-router";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetUser();
  console.log("data", data);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    navigate("/auth");
    return <h1>Redirecting...</h1>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
