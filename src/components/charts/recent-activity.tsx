"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { db } from "@/src/lib/db";
import { Calendar, User, MessageCircle, Monitor } from "lucide-react";
import { formatDate } from "@/src/utils/FormteData";

export function RecentActivity() {
  const reservations = db.reservations.findAll();
  const patients = db.patients.findAll();
  const services = db.services.findAll();

  // Get recent reservations (last 10)
  const recentReservations = reservations
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReservations.map((reservation) => {
            const patient = patients.find(
              (p) => p.id === reservation.patientId
            );
            const service = services.find(
              (s) => s.id === reservation.serviceId
            );

            return (
              <div
                key={reservation.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <div className="flex-shrink-0 mt-1">
                  {reservation.origin === "whatsapp" ? (
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Monitor className="h-4 w-4 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium font-serif truncate">
                      {patient?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-serif">
                      {service?.name} - {formatDate(reservation.date)}
                      {reservation.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getStatusColor(
                        reservation.status
                      )} text-xs font-sans`}
                    >
                      {reservation.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-serif">
                      {service?.price} Bs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
