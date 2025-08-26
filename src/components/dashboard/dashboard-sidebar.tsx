"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  Calendar,
  Users,
  Briefcase,
  CalendarDays,
  BarChart3,
  MessageSquare,
  Stethoscope,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Pacientes", href: "/dashboard/patients", icon: Users },
  { name: "Servicios", href: "/dashboard/services", icon: Briefcase },
  { name: "Reservas", href: "/dashboard/reservations", icon: CalendarDays },
  { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
  { name: "Reportes", href: "/dashboard/reports", icon: FileText },
  { name: "Chat IA", href: "/dashboard/chat", icon: MessageSquare },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-sidebar-foreground font-sans">
            Clínica Pro
          </span>
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors font-serif",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
