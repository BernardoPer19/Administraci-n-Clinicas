"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { db } from "@/src/lib/db";
import { Reservation, Service } from "@prisma/client";

interface Props {
  services: Service[];
  reservations: Reservation[];
}

export function RevenueChart({ services, reservations }: Props) {
  // Generate revenue data for the last 6 months
  const revenueData = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthReservations = reservations.filter(
      (r) =>
        r.status === "COMPLETED" &&
        r.date.getMonth() === date.getMonth() &&
        r.date.getFullYear() === date.getFullYear()
    );

    const monthRevenue = monthReservations.reduce((sum, r) => {
      const service = services.find((s) => s.id === r.serviceId);
      return sum + (service?.price || 0);
    }, 0);

    revenueData.push({
      month: date.toLocaleDateString("es", { month: "short" }),
      revenue: monthRevenue,
      reservations: monthReservations.length,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Ingresos por Mes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "revenue" ? `${value} Bs` : value,
                name === "revenue" ? "Ingresos" : "Reservas",
              ]}
            />
            <Bar dataKey="revenue" fill="#ff0000" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
