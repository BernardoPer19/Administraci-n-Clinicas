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
  Cell,
} from "recharts";
import { Reservation, Service } from "@prisma/client";

interface Props {
  services: Service[];
  reservations: Reservation[];
}

export function ServicesRankingChart({ services, reservations }: Props) {
  const serviceStats = services.map((service) => {
    const serviceReservations = reservations.filter(
      (r) => r.serviceId === service.id
    );
    const completedReservations = serviceReservations.filter(
      (r) => r.status === "COMPLETED"
    );
    const revenue = completedReservations.reduce(
      (sum, r) => sum + service.price,
      0
    );
    return {
      name: service.name,
      reservations: serviceReservations.length,
      completed: completedReservations.length,
      revenue,
      color: service.color,
    };
  });

  serviceStats.sort((a, b) => b.reservations - a.reservations);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Ranking de Servicios</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={serviceStats}
            layout="horizontal"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip
              formatter={(value, name) => [
                name === "revenue" ? `${value} Bs` : value,
                name === "reservations"
                  ? "Reservas"
                  : name === "completed"
                  ? "Completadas"
                  : "Ingresos",
              ]}
            />
            <Bar dataKey="reservations" name="Reservas">
              {serviceStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.color ??
                    ["#4f46e5", "#16a34a", "#dc2626", "#f59e0b", "#3b82f6"][
                      index % 5
                    ]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
