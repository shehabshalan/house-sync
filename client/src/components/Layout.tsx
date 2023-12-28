import { ReactNode } from "react";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
  user: User | undefined;
};

const Layout = ({ children, user }: LayoutProps) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header user={user} />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
        {children}
      </main>
    </div>
  );
};

export default Layout;
