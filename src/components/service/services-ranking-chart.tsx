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
import { db } from "@/src/lib/db";

export function ServicesRankingChart() {
  const services = db.services.findAll();
  const reservations = db.reservations.findAll();

  // Calculate service popularity
  const serviceStats = services.map((service) => {
    const serviceReservations = reservations.filter(
      (r) => r.serviceId === service.id
    );
    const completedReservations = serviceReservations.filter(
      (r) => r.status === "completed"
    );
    const revenue = completedReservations.reduce(
      (sum) => sum + service.price,
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

  // Sort by number of reservations
  serviceStats.sort((a, b) => b.reservations - a.reservations);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Ranking de Servicios</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={serviceStats} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
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
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
