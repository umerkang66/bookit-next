import type { PropsWithChildren, FC } from "react";
import { Navbar } from "../common/navbar";
import { useUser } from "~/hooks/use-user";
import { Spinner } from "../ui/spinner";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, status } = useUser();
  let content: JSX.Element = <Navbar />;

  if (status === "loading") {
    content = (
      <>
        <Navbar />
        <div className="flex items-center justify-center px-10 py-10 sm:px-20 md:px-32">
          <div className="p-20 font-black">
            <Spinner size={50} />
          </div>
        </div>
      </>
    );
  }

  if (
    status === "unauthenticated" ||
    (status === "authenticated" && user?.role !== "ADMIN")
  ) {
    content = (
      <>
        <Navbar />
        <div className="flex items-center justify-center px-10 py-10 sm:px-20 md:px-32">
          <div className="rounded bg-gray-100 p-20 text-2xl font-bold">
            UnAuthorized
          </div>
        </div>
      </>
    );
  }

  if (user?.role === "ADMIN") {
    content = (
      <>
        <Navbar />
        <div className="px-10 py-10 sm:px-20 md:px-32">{children}</div>
      </>
    );
  }

  return content;
};

export { AdminLayout };
