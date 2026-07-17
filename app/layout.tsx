import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NavBar from "./components/navBar/NavBar";
import SideBar from "./components/sideBar/SideBar";
import "./globals.css";
import ReduxProvider from "./components/reduxProvider/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Taskly",
  description: "Editorial task management for focused teams.",
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
          {hasToken && <NavBar />}
          {hasToken && <SideBar />}
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
