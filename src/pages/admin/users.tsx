import classNames from "classnames";
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC, PropsWithChildren } from "react";
import { AiOutlineDelete } from "react-icons/ai";

import { Spinner } from "~/components/ui/spinner";
import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";
import {
  SortableTable,
  type SortableTableProps,
} from "~/components/ui/sortable-table";
import Image from "next/image";
import { getPaginationQueries } from "~/utils/common";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const AdminUsers: NextPage<Props> = () => {
  const apiUtils = api.useContext();
  const router = useRouter();

  const userDeleteMutation = api.user.delete.useMutation({
    onSuccess: () => apiUtils.user.getAll.invalidate(),
  });

  const { page, take, sort } = getPaginationQueries(router);

  const { data, isFetching } = api.user.getAll.useQuery(
    { page, take, sort },
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // whenever current query data arrives, prefetch the next one
      onSuccess: () => {
        void apiUtils.user.getAll.prefetch({ page: page + 1, take, sort });
      },
      // convert the data that can match the types of SortableTypeProps['rowData']
      select: (data) =>
        data.users.map((user) => ({
          id: user.id,
          name: user.name!,
          email: user.email!,
          image: user.image!,
          role: user.role,
          bookings: user.bookings.length,
          reviews: user.reviews.length,
          rooms: user.rooms.length,
          actions: createActions({
            busy:
              userDeleteMutation.isLoading &&
              userDeleteMutation.variables?.userId === user.id,
            onDelete: () => userDeleteMutation.mutate({ userId: user.id }),
          }),
        })),
    },
  );

  if (!data) return null;

  type Data = NonNullable<typeof data>[0];
  type Config = SortableTableProps<Data, Data[keyof Data]>["config"];

  // first generic is type of single data, second type is the value of single data prop
  const config: Config = [
    // there should be only props, its either label or header
    {
      label: "Avatar",
      render: (item) => (
        <div className="flex items-center justify-center">
          <Image
            src={item.image}
            height={50}
            width={50}
            className="rounded-full"
            alt={item.name}
          />
        </div>
      ),
    },
    {
      label: "User ID",
      render: (item) => item.id,
      // if we are using regular table, use don't add this value
      sortValueBy: (item) => item.id,
    },
    {
      label: "Name",
      render: (item) => item.name,
      sortValueBy: (item) => item.name,
    },
    {
      label: "Email",
      render: (item) => item.email,
      sortValueBy: (item) => item.email,
    },
    {
      label: "Role",
      render: (item) => item.role,
      sortValueBy: (item) => item.role,
    },
    {
      label: "Bookings",
      render: (item) => item.bookings,
      sortValueBy: (item) => item.bookings,
    },
    {
      label: "Reviews",
      render: (item) => item.reviews,
      sortValueBy: (item) => item.reviews,
    },
    {
      label: "Rooms",
      render: (item) => item.rooms,
      sortValueBy: (item) => item.rooms,
    },
    {
      label: "Actions",
      render: (item) => item.actions,
    },
  ];

  const nextPage = () => {
    void router.push(
      `/admin/users/?page=${page + 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  const prevPage = () => {
    if (page <= 1) return;
    void router.push(
      `/admin/users/?page=${page - 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  return (
    <>
      <Head>
        <title>Admin All Users</title>
        <meta
          name="description"
          content="Page where admin can look and delete users"
        />
      </Head>

      <div className="flex flex-col items-center justify-center">
        {!data.length && (
          <div className="flex items-center justify-center p-10 text-2xl font-bold">
            No Users Found
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

const ActionBtn: FC<
  PropsWithChildren<{ className?: string; onClick?: () => void }>
> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={classNames(
        className,
        "flex h-10 w-10 items-center justify-center rounded transition hover:opacity-75 active:opacity-90",
      )}
    >
      {children}
    </button>
  );
};

// not a react component but a regular function
function createActions(props: { busy?: boolean; onDelete?: () => void }) {
  const { busy, onDelete } = props;

  return (
    <div className="flex items-center space-x-1 text-white">
      <ActionBtn onClick={onDelete} className="bg-red-600">
        {busy ? <Spinner /> : <AiOutlineDelete size={20} />}
      </ActionBtn>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // use the client router with the option { shallow: true }
  const { page, sort, take } = getPaginationQueries(ctx);

  const api = await apiSSR(ctx);

  // this will only run if the page is reloaded from scratch
  await api.user.getAll.prefetch({ page, take, sort });

  // PRE-FETCH THE NEXT PAGE
  // don't use its promise, fetch the next page in the background
  void api.user.getAll.prefetch({ page: page + 1, take, sort });

  // PRE-FETCH THE PREVIOUS PAGE
  if (page > 1) {
    // don't use its promise, fetch the next page in the background
    void api.user.getAll.prefetch({ page: page - 1, take, sort });
  }

  return {
    props: {
      // this creates a frozen represented of cache, that can be used by trpc to, create the html in the server
      trpcState: api.dehydrate(),
    },
  };
};

export default AdminUsers;
