import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import ReduxProvider from "./components/reduxProvider/ReduxProvider";
import DashboardLayout from "./components/dashboardLayout/DashboardLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Taskly",
  description: "Editorial task management for focused teams.",
  icons:{
    icon:'/Logo.svg'
  }
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
          
          <DashboardLayout hasToken={hasToken}>
            {children}
          </DashboardLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
