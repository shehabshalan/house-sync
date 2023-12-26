import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import ProtectedRoute from "@/ProtectedRoute";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/NotFound";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Auth = lazy(() => import("@/pages/Auth"));

const Router = () => {
  return (
    <Suspense fallback={<Loader2 />}>
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
