import type React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/src/lib/auth";
import { DashboardSidebar } from "@/src/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/src/components/dashboard/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardHeader user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
