import Layout from "@/components/Layout";
import { useGetUser } from "@/services/useGetUser";
import { ReactNode } from "react";
import Loading from "./Loading";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useGetUser();

  return <Layout user={data}>{isLoading ? <Loading /> : children}</Layout>;
};

export default DashboardLayout;
