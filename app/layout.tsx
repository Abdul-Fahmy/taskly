import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import ReduxProvider from "./components/reduxProvider/ReduxProvider";
import { Toaster } from "react-hot-toast";
import RecoveryHashRedirect from "./components/RecoveryHashRedirect";
import SessionKeepAlive from "./components/SessionKeepAlive";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Taskly",
  description: "Editorial task management for focused teams.",
  icons: {
    icon: "/Logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasAccessToken = Boolean(cookieStore.get("access_token")?.value);
  const hasRefreshToken = Boolean(cookieStore.get("refresh_token")?.value);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ReduxProvider>
          <RecoveryHashRedirect />
          <SessionKeepAlive enabled={hasAccessToken || hasRefreshToken} />
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
