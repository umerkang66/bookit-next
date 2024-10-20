import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { type FC } from "react";
import dateFormat from "dateformat";

import {
  SortableTable,
  type SortableTableProps,
} from "~/components/ui/sortable-table";
import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";
import { getPaginationQueries } from "~/utils/common";

interface Props {}

const Bookings: FC<Props> = () => {
  const router = useRouter();
  const apiUtils = api.useContext();

  const { page, sort, take } = getPaginationQueries(router);

  const { data, isInitialLoading } = api.booking.getByUser.useQuery(
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
        void apiUtils.booking.getByUser.prefetch({
          page: page + 1,
          take,
          sort,
        });
      },
      select(data) {
        return data.bookings.map((booking) => ({
          ...booking,
          amountPaid: `$${booking.amountPaid}`,
          paidOn: dateFormat(booking.paidOn, "d-mmm-yyyy"),
          checkInDate: dateFormat(booking.checkInDate, "d-mmm-yyyy"),
          checkOutDate: dateFormat(booking.checkOutDate, "d-mmm-yyyy"),
          paymentInfo: booking.paymentInfo.status,
        }));
      },
    },
  );

  type Data = NonNullable<typeof data>[0];
  type Config = SortableTableProps<Data, Data[keyof Data]>["config"];

  // first generic is type of single data, second type is the value of single data prop
  const config: Config = [
    // there should be only props, its either label or header
    {
      label: "Booking ID",
      render: (item) => item.id,
      // if we are using regular table, use don't add this value
      sortValueBy: (item) => item.id,
    },
    {
      label: "Paid On",
      render: (item) => item.paidOn,
      sortValueBy: (item) => item.paidOn,
    },
    {
      label: "Amount",
      render: (item) => item.amountPaid,
      sortValueBy: (item) => item.amountPaid,
    },
    {
      label: "Status",
      render: (item) => item.paymentInfo,
      sortValueBy: (item) => item.paymentInfo,
    },
    {
      label: "Room Id",
      render: (item) => item.roomId,
      sortValueBy: (item) => item.roomId,
    },
    {
      label: "Days",
      render: (item) => item.daysOfStay,
      sortValueBy: (item) => item.daysOfStay,
    },
    {
      label: "Check In",
      render: (item) => item.checkInDate,
      sortValueBy: (item) => item.checkInDate,
    },
    {
      label: "Check Out",
      render: (item) => item.checkOutDate,
      sortValueBy: (item) => item.checkOutDate,
    },
  ];

  const nextPage = () => {
    void router.push(
      `/me/bookings/?page=${page + 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  const prevPage = () => {
    if (page <= 1) return;
    void router.push(
      `/me/bookings/?page=${page - 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  if (!data) return null;

  return (
    <>
      <Head>
        <title>My Bookings</title>
        <meta name="description" content="My Bookings" />
      </Head>

      <div className="flex flex-col items-center justify-center">
        {!data.length && (
          <div className="flex items-center justify-center p-10 text-2xl font-bold">
            No Bookings Found
          </div>
        )}

        <SortableTable
          rowData={data}
          config={config}
          keyFn={(item) => item.id}
          currentPage={page}
          paginationBusy={isInitialLoading}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          disablePrevPage={page <= 1}
          disableNextPage={data.length < take}
          padding={"py-1 px-3"}
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
  const promises = [api.booking.getByUser.prefetch({ page, take, sort })];

  // PRE-FETCH THE NEXT PAGE
  // don't use its promise, fetch the next page in the background
  promises.push(api.booking.getByUser.prefetch({ page: page + 1, take, sort }));

  // PRE-FETCH THE PREVIOUS PAGE
  if (page > 1) {
    // don't use its promise, fetch the next page in the background
    promises.push(
      api.booking.getByUser.prefetch({ page: page - 1, take, sort }),
    );
  }

  await Promise.all(promises);

  return {
    props: {
      // this creates a frozen represented of cache, that can be used by trpc to, create the html in the server
      trpcState: api.dehydrate(),
    },
  };
};

export default Bookings;
