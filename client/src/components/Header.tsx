import { FrameIcon, LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ROUTES } from "@/routes/Routes";

type HeaderProps = {
  user: User | undefined;
};

const NAV_ITEMS = [
  {
    name: "Spaces",
    href: ROUTES.DASHBOARD,
    className: "font-bold",
  },

  {
    name: "Settings",
    href: "#",
    className: "text-gray-500 dark:text-gray-400",
  },
];

const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const handleSignout = () => {
    window.google.accounts.id.revoke(user?.email, () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth");
    });
  };
  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
      <Link
        className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
        to="#"
      >
        <FrameIcon className="w-6 h-6" />
      </Link>
      <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
        {NAV_ITEMS.map((item) => (
          <Link className={item.className} to={item.href} key={item.name}>
            {item.name}
          </Link>
        ))}
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
  );
};

export default Header;
