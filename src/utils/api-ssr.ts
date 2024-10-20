import type { GetServerSidePropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { appRouter } from "~/server/api/root";
import { createTRPCContextSSR } from "~/server/api/trpc";

export const apiSSR = async ({
  req,
  res,
}: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const context = await createTRPCContextSSR({ req, res });

  // this will return the server helpers react query object, from where we can prefetch the data. like fetch, prefetch
  return createServerSideHelpers({
    router: appRouter,
    ctx: context,
    transformer: superjson,
  });
};
