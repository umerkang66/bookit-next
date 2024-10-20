import { type NextPage } from "next";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { RoomForm } from "~/components/room/room-form";
import { api } from "~/utils/api";

interface Props {}

const Create: NextPage<Props> = () => {
  const roomCreateMutation = api.room.create.useMutation({
    onSuccess: () => toast.success("🚀🚀🚀 Room Created"),
  });

  return (
    <>
      <Head>
        <title>Create Room | BookIT</title>
      </Head>

      <RoomForm
        btnText="Create"
        busy={roomCreateMutation.isLoading}
        onSubmit={(room) => {
          const roomWithNonNullableProps = room as Required<typeof room>;

          roomCreateMutation.mutate(roomWithNonNullableProps);
        }}
      />
    </>
  );
};

export default Create;
