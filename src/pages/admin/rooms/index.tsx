import classNames from "classnames";
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC, PropsWithChildren } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsArrowUpRightCircle } from "react-icons/bs";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";
import {
  SortableTable,
  type SortableTableProps,
} from "~/components/ui/sortable-table";
import { getPaginationQueries } from "~/utils/common";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const AdminRooms: NextPage<Props> = () => {
  const apiUtils = api.useContext();
  const router = useRouter();

  const roomDeleteMutation = api.room.delete.useMutation({
    onSuccess: () => apiUtils.room.getAll.invalidate(),
  });

  const { page, take, sort } = getPaginationQueries(router);

  const { data, isFetching } = api.room.getAll.useQuery(
    { page, take, sort },
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // whenever current query data arrives, prefetch the next one
      onSuccess: () => {
        void apiUtils.room.getAll.prefetch({ page: page + 1, take, sort });
      },
      // convert the data that can match the types of SortableTypeProps['rowData']
      select: (data) =>
        data.rooms.map((room) => ({
          roomId: room.id,
          name: room.name,
          price: room.price,
          category: room.category,
          actions: createActions({
            busy:
              roomDeleteMutation.isLoading &&
              roomDeleteMutation.variables?.roomId === room.id,
            onOpen: () => window.open(`/${room.id}`, "_blank"),
            onDelete: () => roomDeleteMutation.mutate({ roomId: room.id }),
            onEdit: () => void router.push(`/admin/rooms/${room.id}`),
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
      label: "Room ID",
      render: (item) => item.roomId,
      // if we are using regular table, use don't add this value
      sortValueBy: (item) => item.roomId,
    },
    {
      label: "Name",
      render: (item) => item.name,
      sortValueBy: (item) => item.name,
    },
    {
      label: "Price",
      render: (item) => item.price,
      sortValueBy: (item) => item.price,
    },
    {
      label: "Category",
      render: (item) => item.category,
      sortValueBy: (item) => item.category,
    },
    { label: "Actions", render: (item) => item.actions },
  ];

  const nextPage = () => {
    void router.push(
      `/admin/rooms/?page=${page + 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  const prevPage = () => {
    if (page <= 1) return;
    void router.push(
      `/admin/rooms/?page=${page - 1}&take=${take}&sort=${sort}`,
      undefined,
      { shallow: true },
    );
  };

  return (
    <>
      <Head>
        <title>Admin All Rooms</title>
        <meta
          name="description"
          content="Page where admin can update or delete rooms"
        />
      </Head>

      <div className="flex flex-col items-center justify-center">
        <Button
          className="mb-10 self-end"
          onClick={() => void router.push("/admin/rooms/create")}
          primary
        >
          Create new Room
        </Button>

        {!data.length && (
          <div className="flex items-center justify-center p-10 text-2xl font-bold">
            No Rooms Found
          </div>
        )}

        <SortableTable
          rowData={data}
          config={config}
          keyFn={(item) => item.roomId}
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
function createActions(props: {
  busy?: boolean;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { busy, onOpen, onEdit, onDelete } = props;

  return (
    <div className="flex items-center space-x-1 text-white">
      <ActionBtn onClick={onOpen} className="bg-blue-600">
        <BsArrowUpRightCircle size={20} />
      </ActionBtn>
      <ActionBtn onClick={onEdit} className="bg-blue-800">
        <AiOutlineEdit size={20} />
      </ActionBtn>
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

export default AdminRooms;
