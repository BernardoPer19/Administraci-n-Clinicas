"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { db } from "@/src/lib/db";
import { Reservation, Patient, Service } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MessageCircle,
  Monitor,
  Plus,
  UserPlus,
} from "lucide-react";
import { AddReservationDialog } from "@/src/components/reservations/add-reservation-dialog";
import { AddPatientDialog } from "@/src/components/patient/add-patient-dialog";
import { useCalendarViews } from "@/src/hooks/use-calendar";
import { useDragDropCalendar } from "@/src/hooks/use-drag&drop-calendar";

type ViewType = "month" | "week" | "year";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const patients = db.patients.findAll();
  const services = db.services.findAll();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewType === "year") {
      newDate.setFullYear(
        newDate.getFullYear() + (direction === "next" ? 1 : -1)
      );
    }

    setCurrentDate(newDate);
  };

  const exportCalendar = () => {
    alert("Funcionalidad de exportación en desarrollo");
  };

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(
      (reservation) => reservation.date.toDateString() === date.toDateString()
    );
  };

  const {
    handleDragStart,
    handleDragOver,
    handleDrop,
    draggedReservation,
    setDraggedReservation,
  } = useDragDropCalendar();

  const { renderMonthView, renderWeekView, renderYearView } = useCalendarViews({
    currentDate,
    reservations,
    patients,
    services,
    getReservationsForDate,
    handleDragStart,
    handleDragOver,
    handleDrop,
  });

  const formatDateRange = () => {
    if (viewType === "month") {
      return currentDate.toLocaleDateString("es", {
        month: "long",
        year: "numeric",
      });
    } else if (viewType === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString("es", {
        day: "numeric",
        month: "short",
      })} - ${endOfWeek.toLocaleDateString("es", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    } else {
      return currentDate.getFullYear().toString();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold font-sans min-w-[200px] text-center">
              {formatDateRange()}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoy
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <AddReservationDialog>
            <Button size="sm" className="font-sans">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva
            </Button>
          </AddReservationDialog>

          <AddPatientDialog>
            <Button
              size="sm"
              variant="outline"
              className="font-sans bg-transparent"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Paciente
            </Button>
          </AddPatientDialog>

          <Select
            value={viewType}
            onValueChange={(value: ViewType) => setViewType(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="year">Año</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportCalendar}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-4">
        {viewType === "month" && renderMonthView()}
        {viewType === "week" && renderWeekView()}
        {viewType === "year" && renderYearView()}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground font-serif">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-green-600" />
          <span>WhatsApp</span>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-blue-600" />
          <span>Sistema</span>
        </div>
        <span>• Arrastra las reservas para cambiar fecha</span>
        <span>
          • Haz hover sobre las fechas para crear reservas rápidamente
        </span>
      </div>
    </div>
  );
}
