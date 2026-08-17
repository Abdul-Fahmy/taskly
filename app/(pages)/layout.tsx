import DashboardLayout from "@/app/components/dashboardLayout/DashboardLayout";
import { cookies } from "next/headers";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasAccessToken = Boolean(cookieStore.get("access_token")?.value);

  return (
    <DashboardLayout hasToken={hasAccessToken}>{children}</DashboardLayout>
  );
}
