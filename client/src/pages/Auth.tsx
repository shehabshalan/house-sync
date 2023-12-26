import { useAuth } from "@/services/useAuth";
import { initGoogleAuth } from "@/utils/utils";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const { toast } = useToast();
  const { mutate } = useAuth();

  const handleCallbackResponse = (response: any) => {
    const token = response.credential;
    mutate(token, {
      onSuccess(data) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
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
            <h1 className="text-3xl font-bold">Login</h1>
          </div>
          <div className="space-y-4">
            <div id="login-div" className="w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
