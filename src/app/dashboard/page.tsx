import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { RevenueChart } from "@/src/components/charts/revenue-chart";
import { ReservationsChart } from "@/src/components/reservations/reservations-chart";
import { ServicesRankingChart } from "@/src/components/service/services-ranking-chart";
import { RecentActivity } from "@/src/components/charts/recent-activity";
import { db } from "@/src/lib/db";
import { Users, Calendar, Briefcase, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const patients = db.patients.findAll();
  const services = db.services.findAll();
  const reservations = db.reservations.findAll();

  const totalRevenue = reservations
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => {
      const service = services.find((s) => s.id === r.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const thisMonthReservations = reservations.filter((r) => {
    const now = new Date();
    return (
      r.date.getMonth() === now.getMonth() &&
      r.date.getFullYear() === now.getFullYear()
    );
  });

  const pendingRevenue = reservations
    .filter((r) => r.status === "confirmed" || r.status === "pending")
    .reduce((sum, r) => {
      const service = services.find((s) => s.id === r.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-sans">
          Dashboard
        </h1>
        <p className="text-muted-foreground font-serif">
          Resumen general de la clínica
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Total Pacientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {patients.length}
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              +
              {
                patients.filter(
                  (p) =>
                    new Date(p.createdAt).getMonth() === new Date().getMonth()
                ).length
              }{" "}
              este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Reservas Este Mes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {thisMonthReservations.length}
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              {reservations.filter((r) => r.status !== "cancelled").length}{" "}
              activas total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Servicios Activos
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {services.length}
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              Precio promedio:{" "}
              {Math.round(
                services.reduce((sum, s) => sum + s.price, 0) / services.length
              )}{" "}
              Bs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Ingresos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {totalRevenue} Bs
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              +{pendingRevenue} Bs pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <ReservationsChart />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ServicesRankingChart />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
