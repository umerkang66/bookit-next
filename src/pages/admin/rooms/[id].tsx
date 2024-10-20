import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { RoomForm } from "~/components/room/room-form";
import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Update: NextPage<Props> = ({ id }) => {
  const roomUpdateMutation = api.room.update.useMutation({
    onSuccess: () => toast.success("🚀🚀🚀 Room Updated"),
  });

  const { data, isLoading } = api.room.getOne.useQuery(
    { roomId: id },
    {
      select(data) {
        // update the data returned from use query
        // images should only urls array
        return {
          room: {
            ...data.room,
            images: data.room?.images.map((img) => img.url),
          },
        };
      },
    },
  );

  return (
    <>
      <Head>
        <title>Update {data?.room?.name ?? "Room"} | BookIT</title>
      </Head>

      {isLoading || !data ? null : (
        <RoomForm
          btnText="Update"
          // @ts-ignore
          initialData={data.room}
          busy={roomUpdateMutation.isLoading}
          onSubmit={(room) => roomUpdateMutation.mutate({ id, data: room })}
        />
      )}
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params?.id as string;
  const api = await apiSSR(ctx);

  // prefetch the data, and pass the whole state in trpcState
  await api.room.getOne.prefetch({ roomId: id });

  return {
    props: {
      // this creates a frozen represented of cache, that can be used by trpc to, create the html in the server
      trpcState: api.dehydrate(),
      id,
    },
  };
};

export default Update;
