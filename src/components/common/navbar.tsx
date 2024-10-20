import { useState, type FC } from "react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { AiFillCaretDown, AiFillGithub } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIsFetching } from "@tanstack/react-query";

import { useUser } from "~/hooks/use-user";
import { Selector, type SelectorOption } from "../ui/selector";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface Props {}

const Navbar: FC<Props> = () => {
  const { user } = useUser();
  const [showSelector, setShowSelector] = useState(false);
  const router = useRouter();
  const isFetching = useIsFetching();

  const selectorHead = (
    <div
      onClick={() => setShowSelector((prev) => !prev)}
      className="absolute right-0 flex -translate-y-[50%] cursor-pointer items-center space-x-1"
    >
      {user && user.image && (
        <Image
          className="rounded-full"
          height={30}
          width={30}
          src={user.image}
          alt="User"
        />
      )}
      <AiFillCaretDown />
    </div>
  );

  // this generics is what should be the title is
  const selectorOptions: SelectorOption<string | JSX.Element>[] = [
    {
      title: <p className="font-semibold text-red-400">Sign Out</p>,
      onClick: () => void signOut(),
    },
    { title: "My Bookings", onClick: () => void router.push("/me/bookings") },
    { title: "My Reviews", onClick: () => void router.push("/me/reviews") },
    { title: "Me", onClick: () => void router.push("/me") },
  ];

  if (user?.role === "ADMIN") {
    selectorOptions.push(
      ...[
        { title: "Rooms", onClick: () => void router.push("/admin/rooms") },
        { title: "Reviews", onClick: () => void router.push("/admin/reviews") },
        { title: "Users", onClick: () => void router.push("/admin/users") },
        {
          title: "Bookings",
          onClick: () => void router.push("/admin/bookings"),
        },
      ],
    );
  }

  return (
    <div className="flex h-20 w-full items-center justify-between bg-gray-900 px-3 py-1 text-white">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <h1 className="text-2xl font-bold">BookIt</h1>
        </Link>
        {!!isFetching && <Spinner className="text-white" />}
      </div>

      {!user ? (
        <Button onClick={() => void signIn("github")} primaryLight>
          <div className="flex items-center space-x-1">
            <span className="inline-block font-semibold">Sign in with</span>
            <AiFillGithub size={24} />
          </div>
        </Button>
      ) : (
        <Selector
          className="w-32"
          name="navbar-selector"
          showOptions={showSelector}
          options={selectorOptions}
          head={selectorHead}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
};

export { Navbar };
