import { type Session } from "next-auth";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import NextNProgress from "nextjs-progressbar";
import "~/styles/globals.css";

import { api } from "~/utils/api";
import { MainLayout } from "~/components/layout/main-layout";
import { AdminLayout } from "~/components/layout/admin-layout";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const isAdminRoute = router.pathname.includes("admin");

  const Layout = isAdminRoute ? AdminLayout : MainLayout;

  return (
    <>
      <Head>
        <title>BookIt</title>
        <meta name="description" content="Book Hotels Rooms" />
      </Head>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="bottom-right" />
      <NextNProgress options={{ showSpinner: false }} />
    </>
  );
};

export default api.withTRPC(MyApp);
