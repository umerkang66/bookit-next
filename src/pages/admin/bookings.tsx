import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import dateFormat from "dateformat";

import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";
import {
  SortableTable,
  type SortableTableProps,
} from "~/components/ui/sortable-table";
import { getPaginationQueries } from "~/utils/common";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const AdminBookings: NextPage<Props> = () => {
  const apiUtils = api.useContext();
  const router = useRouter();

  const { page, take, sort } = getPaginationQueries(router);

  const { data, isFetching } = api.booking.getAll.useQuery(
    { page, take, sort },
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // whenever current query data arrives, prefetch the next one
      onSuccess: () => {
        void apiUtils.booking.getAll.prefetch({ page: page + 1, take, sort });
      },
      // convert the data that can match the types of SortableTypeProps['rowData']
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

  if (!data) return null;

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
      `/admin/bookings/?page=${page + 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  const prevPage = () => {
    if (page <= 1) return;
    void router.push(
      `/admin/bookings/?page=${page - 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  return (
    <>
      <Head>
        <title>Admin All Bookings</title>
        <meta
          name="description"
          content="Page where admin can look and delete bookings"
        />
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
          paginationBusy={isFetching}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          disablePrevPage={page <= 1}
          disableNextPage={data.length < take}
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
  await api.booking.getAll.prefetch({ page, take, sort });

  // PRE-FETCH THE NEXT PAGE
  // don't use its promise, fetch the next page in the background
  void api.booking.getAll.prefetch({ page: page + 1, take, sort });

  // PRE-FETCH THE PREVIOUS PAGE
  if (page > 1) {
    // don't use its promise, fetch the next page in the background
    void api.booking.getAll.prefetch({ page: page - 1, take, sort });
  }

  return {
    props: {
      // this creates a frozen represented of cache, that can be used by trpc to, create the html in the server
      trpcState: api.dehydrate(),
    },
  };
};

export default AdminBookings;
