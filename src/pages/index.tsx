import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";
import { PaginationActions } from "~/components/ui/pagination-actions";
import { RoomItem } from "~/components/room/room-item";
import { getPaginationQueries } from "~/utils/common";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPage<Props> = ({}) => {
  const router = useRouter();
  // this will used to revalidate, fetch or refetch the queries
  const apiUtils = api.useContext();

  // we are getting these values second time, because gSSP will only run on first load
  const { page, take, sort } = getPaginationQueries(router);

  const { data, isFetching } = api.room.getAll.useQuery(
    { page, take, sort },
    {
      // while loading keep previous data
      // we don't want to keep previous data
      // during loading, because we already have data in our cache
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // whenever current query data arrives, prefetch the next one
      onSuccess: () => {
        void apiUtils.room.getAll.prefetch({ page: page + 1, take, sort });
      },
    },
  );

  const routeToPage = (page: number) => {
    void router.push(`/?page=${page}&take=${take}&sort=${sort}`, undefined, {
      shallow: true,
    });
  };

  const onPrevPage = () => {
    if (page <= 1) return;
    routeToPage(page - 1);
  };

  const onNextPage = () => {
    if (data) {
      if (data.rooms.length < take) return;
    }
    routeToPage(page + 1);
  };

  return (
    <>
      <Head>
        <title>All Rooms | page - {page} | BookIT</title>
      </Head>
      <h1 className="mb-10 text-4xl font-bold text-gray-900">
        All Rooms | Page - {page}
      </h1>

      <div className="flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isFetching && !data?.rooms.length && (
            <p className="rounded bg-gray-200 p-4 text-center text-2xl font-bold">
              No Rooms Found
            </p>
          )}

          {!!data &&
            data.rooms.map((room) => <RoomItem room={room} key={room.id} />)}
        </div>

        <PaginationActions
          currentPage={page}
          disablePrevPage={page === 1}
          disableNextPage={
            (data?.rooms.length ?? Number.MIN_SAFE_INTEGER) < take
          }
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          paginationBusy={isFetching}
        />
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // use the client router with the option { shallow: true }
  const { page, sort, take } = getPaginationQueries(ctx);

  const api = await apiSSR(ctx);

  // this will only run if the page is reloaded from scratch
  const promises = [api.room.getAll.prefetch({ page, take, sort })];

  // PRE-FETCH THE NEXT PAGE
  // don't use its promise, fetch the next page in the background
  promises.push(api.room.getAll.prefetch({ page: page + 1, take, sort }));

  // PRE-FETCH THE PREVIOUS PAGE
  if (page > 1) {
    // don't use its promise, fetch the next page in the background
    promises.push(api.room.getAll.prefetch({ page: page - 1, take, sort }));
  }

  await Promise.all(promises);

  return {
    props: {
      // this creates a frozen represented of cache, that can be used by trpc to, create the html in the server
      trpcState: api.dehydrate(),
    },
  };
};

export default Home;
