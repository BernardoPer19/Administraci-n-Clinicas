"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import type { Reservation } from "@/src/lib/db";

interface CalendarTooltipProps {
  reservation: Reservation;
  patient: { name: string; phone: string } | undefined;
  service: { name: string; price: number; color: string } | undefined;
  position: { x: number; y: number };
  visible: boolean;
}

export function CalendarTooltip({
  reservation,
  patient,
  service,
  position,
  visible,
}: CalendarTooltipProps) {
  if (!visible) return null;

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
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
      }}
    >
      <Card className="w-64 shadow-lg border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-sans">{patient?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm font-medium font-sans">Servicio: </span>
            <span className="text-sm font-serif">{service?.name}</span>
          </div>
          <div>
            <span className="text-sm font-medium font-sans">Fecha: </span>
            <span className="text-sm font-serif">
              {reservation.date.toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium font-sans">Hora: </span>
            <span className="text-sm font-serif">{reservation.time}</span>
          </div>
          <div>
            <span className="text-sm font-medium font-sans">Precio: </span>
            <span className="text-sm font-serif">{service?.price} Bs</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(
                reservation.status
              )} text-xs font-sans`}
            >
              {reservation.status}
            </Badge>
            <Badge variant="outline" className="text-xs font-sans">
              {reservation.origin}
            </Badge>
          </div>
          {reservation.notes && (
            <div>
              <span className="text-sm font-medium font-sans">Notas: </span>
              <span className="text-sm font-serif">{reservation.notes}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
