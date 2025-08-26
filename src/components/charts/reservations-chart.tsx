"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Reservation } from "@prisma/client";

interface Props {
  reservations: Reservation[];
}

export function ReservationsChart({ reservations }: Props) {
  // Generate reservations data for the last 4 weeks
  const reservationsData = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekReservations = reservations.filter(
      (r) => r.date >= weekStart && r.date <= weekEnd
    );

    const systemReservations = weekReservations.filter(
      (r) => r.origin === "SYSTEM"
    ).length;
    const whatsappReservations = weekReservations.filter(
      (r) => r.origin === "WHATSAPP"
    ).length;

    reservationsData.push({
      week: `Sem ${4 - i}`,
      sistema: systemReservations,
      whatsapp: whatsappReservations,
      total: weekReservations.length,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Reservas por Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reservationsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sistema"
              stroke="#4f46e5"
              strokeWidth={2}
              name="Sistema"
            />
            <Line
              type="monotone"
              dataKey="whatsapp"
              stroke="#16a34a"
              strokeWidth={2}
              name="WhatsApp"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#dc2626"
              strokeWidth={2}
              name="Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
