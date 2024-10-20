import { type GetServerSidePropsContext, type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";
import { capitalize } from "~/utils/common";

interface Props {}

const Me: NextPage<Props> = () => {
  const { data } = api.user.me.useQuery();

  if (!data) return null;

  const user = data.user;

  return (
    <div className="flex h-[calc(100vh-170px)] items-start justify-center">
      <div className="flex items-start space-x-4 bg-gray-100 p-4">
        {!!user.image && (
          <Image
            src={user.image}
            alt={user.name!}
            height={50}
            width={50}
            className="rounded-full"
          />
        )}

        <div className="space-y-2">
          {Object.keys(user).map((userKey: string) =>
            userKey === "image" ? null : (
              <p key={userKey} className="text-xl">
                <span className="font-semibold">{capitalize(userKey)}</span>{" "}
                {user[userKey as keyof typeof user]}
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = await apiSSR(ctx);
  await api.user.me.prefetch();

  return { props: { trpcState: api.dehydrate() } };
};

export default Me;
