import { useAuth } from "@/services/useAuth";
import { initGoogleAuth } from "@/utils/utils";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ROUTES } from "@/routes/Routes";

const Auth = () => {
  const { toast } = useToast();
  const { mutate } = useAuth();

  const handleCallbackResponse = (response: any) => {
    const token = response.credential;
    mutate(token, {
      onSuccess(data) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = ROUTES.DASHBOARD;
        }
      },
      onError(e: Error & { response?: any }) {
        toast({
          variant: "destructive",
          title: e.response?.data?.detail || "An error occurred",
          description: "There was a problem with your request. Try again.",
        });
      },
    });
  };
  useEffect(() => {
    initGoogleAuth(handleCallbackResponse);
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-sm rounded-lg shadow-lg bg-white p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Login to your account to access your spaces.
            </p>
          </div>
          <div className="space-y-4">
            <div
              id="login-div"
              className=" flex items-start justify-center"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
