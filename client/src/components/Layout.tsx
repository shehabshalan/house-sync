import { FrameIcon, LogOutIcon } from "lucide-react";
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type LayoutProps = {
  children: ReactNode;
  user: User | undefined;
};
const Layout = ({ children, user }: LayoutProps) => {
  const navigate = useNavigate();
  const handleSignout = () => {
    window.google.accounts.id.revoke(user?.email, () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth");
    });
  };
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <Link
          className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
          to="#"
        >
          <FrameIcon className="w-6 h-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
          <Link className="font-bold" to="#">
            Spaces
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" to="#">
            Members
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" to="#">
            Settings
          </Link>
        </nav>
        <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Button className="rounded-full ml-auto" size="icon" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full border"
              height="32"
              src={user?.picture}
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
          <Button
            className="rounded-full ml-2"
            size="icon"
            variant="ghost"
            onClick={handleSignout}
          >
            <LogOutIcon className="w-4 h-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
        {children}
      </main>
    </div>
  );
};

export default Layout;
