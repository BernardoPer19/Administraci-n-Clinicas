"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { db, type Reservation } from "@/src/lib/db";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
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

type ViewType = "month" | "week" | "year";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [draggedReservation, setDraggedReservation] =
    useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const patients = db.patients.findAll();
  const services = db.services.findAll();

  useEffect(() => {
    setReservations(db.reservations.findAll());
  }, []);

  const refreshData = () => {
    setReservations(db.reservations.findAll());
  };

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

  const handleDragStart = (e: React.DragEvent, reservation: Reservation) => {
    setDraggedReservation(reservation);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newDate: Date) => {
    e.preventDefault();

    if (draggedReservation) {
      db.reservations.update(draggedReservation.id, {
        date: newDate,
      });

      refreshData();
      setDraggedReservation(null);
    }
  };

  const exportCalendar = () => {
    alert("Funcionalidad de exportación en desarrollo");
  };

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(
      (reservation) => reservation.date.toDateString() === date.toDateString()
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateIter = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium text-muted-foreground font-sans"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayReservations = getReservationsForDate(day);
          const isCurrentMonth = day.getMonth() === month;
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-border relative group ${
                isCurrentMonth ? "bg-background" : "bg-muted/30"
              } ${isToday ? "bg-primary/10 border-primary" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <div
                className={`text-sm font-medium mb-2 font-sans ${
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {day.getDate()}
              </div>

              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <AddReservationDialog
                  selectedDate={day}
                  onSuccess={refreshData}
                >
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </AddReservationDialog>
              </div>

              <div className="space-y-1">
                {dayReservations.slice(0, 3).map((reservation) => {
                  const patient = patients.find(
                    (p) => p.id === reservation.patientId
                  );
                  const service = services.find(
                    (s) => s.id === reservation.serviceId
                  );

                  return (
                    <div
                      key={reservation.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, reservation)}
                      className={`text-xs p-1 rounded cursor-move transition-all hover:scale-105 ${
                        reservation.origin === "whatsapp"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-l-2 border-l-green-500"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-l-2 border-l-blue-500"
                      }`}
                      style={{
                        backgroundColor: service?.color + "20",
                        borderLeftColor: service?.color,
                      }}
                      title={`${patient?.name} - ${service?.name} - ${reservation.time}`}
                    >
                      <div className="flex items-center gap-1">
                        {reservation.origin === "whatsapp" ? (
                          <MessageCircle className="h-3 w-3" />
                        ) : (
                          <Monitor className="h-3 w-3" />
                        )}
                        <span className="truncate font-serif">
                          {patient?.name}
                        </span>
                      </div>
                      <div className="truncate font-serif">
                        {reservation.time}
                      </div>
                    </div>
                  );
                })}

                {dayReservations.length > 3 && (
                  <div className="text-xs text-muted-foreground font-serif">
                    +{dayReservations.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="grid grid-cols-8 gap-1">
        <div className="p-2"></div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="p-2 text-center font-medium border-b font-sans"
          >
            <div className="text-sm text-muted-foreground">
              {day.toLocaleDateString("es", { weekday: "short" })}
            </div>
            <div
              className={`text-lg ${
                day.toDateString() === new Date().toDateString()
                  ? "text-primary font-bold"
                  : ""
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}

        {hours.map((hour) => (
          <div key={hour} className="contents">
            <div className="p-2 text-sm text-muted-foreground font-serif border-r">
              {hour}:00
            </div>
            {weekDays.map((day) => {
              const dayReservations = getReservationsForDate(day).filter(
                (r) => {
                  const reservationHour = Number.parseInt(r.time.split(":")[0]);
                  return reservationHour === hour;
                }
              );

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] p-1 border border-border relative group"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AddReservationDialog
                      selectedDate={day}
                      selectedTime={`${hour.toString().padStart(2, "0")}:00`}
                      onSuccess={refreshData}
                    >
                      <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </AddReservationDialog>
                  </div>

                  {dayReservations.map((reservation) => {
                    const patient = patients.find(
                      (p) => p.id === reservation.patientId
                    );
                    const service = services.find(
                      (s) => s.id === reservation.serviceId
                    );

                    return (
                      <div
                        key={reservation.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, reservation)}
                        className={`text-xs p-1 rounded cursor-move mb-1 ${
                          reservation.origin === "whatsapp"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                        style={{ backgroundColor: service?.color + "40" }}
                      >
                        <div className="font-medium font-serif">
                          {patient?.name}
                        </div>
                        <div className="font-serif">{service?.name}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.push(new Date(year, i, 1));
    }

    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((month) => {
          const monthReservations = reservations.filter(
            (r) =>
              r.date.getFullYear() === year &&
              r.date.getMonth() === month.getMonth()
          );

          return (
            <Card
              key={month.getMonth()}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-sans">
                  {month.toLocaleDateString("es", { month: "long" })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary font-sans">
                    {monthReservations.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-serif">
                    reservas este mes
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {services.map((service) => {
                      const serviceCount = monthReservations.filter(
                        (r) => r.serviceId === service.id
                      ).length;
                      if (serviceCount === 0) return null;

                      return (
                        <Badge
                          key={service.id}
                          variant="secondary"
                          className="text-xs font-sans"
                          style={{
                            backgroundColor: service.color + "20",
                            color: service.color,
                          }}
                        >
                          {serviceCount}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

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
          <AddReservationDialog onSuccess={refreshData}>
            <Button size="sm" className="font-sans">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva
            </Button>
          </AddReservationDialog>

          <AddPatientDialog onSuccess={refreshData}>
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
