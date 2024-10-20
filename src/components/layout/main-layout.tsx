import type { PropsWithChildren, FC } from "react";
import { Navbar } from "../common/navbar";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="px-10 py-10 sm:px-20 md:px-32">{children}</div>
    </>
  );
};

export { MainLayout };
