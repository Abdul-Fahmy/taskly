import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NavBar from "./components/navBar/NavBar";
import "./globals.css";
import ReduxProvider from "./components/reduxProvider/ReduxProvider";
import SideBar from "./components/SideBar/SideBar";
import RecoveryHashRedirect from "./components/RecoveryHashRedirect";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
  const hasToken = Boolean(cookieStore.get("access_token")?.value);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ReduxProvider>
          <RecoveryHashRedirect />
          {hasToken && <NavBar />}
          {hasToken && <SideBar />}
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
