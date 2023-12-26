import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import ProtectedRoute from "@/ProtectedRoute";
import NotFound from "@/pages/NotFound";
import Loading from "@/components/Loading";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Auth = lazy(() => import("@/pages/Auth"));

const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.AUTH} element={<Auth />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.ANY} element={<NotFound />} />
        <Route
          path={ROUTES.ROOT}
          element={<Navigate to={ROUTES.DASHBOARD} />}
        />
      </Routes>
    </Suspense>
  );
};

export default Router;
