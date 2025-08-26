"use client";

import { useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { AddReservationDialog } from "@/src/components/reservations/add-reservation-dialog";
import { Plus, MessageCircle, Monitor } from "lucide-react";
import { Reservation, Patient, Service } from "@prisma/client";

interface UseCalendarViewsProps {
  currentDate: Date;
  reservations: Reservation[];
  patients: Patient[];
  services: Service[];
  getReservationsForDate: (date: Date) => Reservation[];
  handleDragStart: (e: React.DragEvent, reservation: Reservation) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, newDate: Date) => void;
}

export function useCalendarViews({
  currentDate,
  reservations,
  patients,
  services,
  getReservationsForDate,
  handleDragStart,
  handleDragOver,
  handleDrop,
}: UseCalendarViewsProps) {
  // ---------- MONTH VIEW ----------
  const renderMonthView = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const iter = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(iter));
      iter.setDate(iter.getDate() + 1);
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
                <AddReservationDialog selectedDate={day}>
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
                      className="text-xs p-1 rounded cursor-move transition-all hover:scale-105"
                      style={{
                        backgroundColor: service?.color + "20",
                        borderLeft: `2px solid ${service?.color}`,
                      }}
                      title={`${patient?.name} - ${service?.name} - ${reservation.time}`}
                    >
                      <div className="flex items-center gap-1">
                        {reservation.origin === "WHATSAPP" ? (
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
  }, [
    currentDate,
    patients,
    services,
    getReservationsForDate,
    handleDrop,
    handleDragOver,
    handleDragStart,
  ]);

  // ---------- WEEK VIEW ----------
  const renderWeekView = useCallback(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

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
              className={
                day.toDateString() === new Date().toDateString()
                  ? "text-primary font-bold text-lg"
                  : "text-lg"
              }
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
                        className="text-xs p-1 rounded cursor-move mb-1"
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
  }, [
    currentDate,
    patients,
    services,
    getReservationsForDate,
    handleDrop,
    handleDragOver,
    handleDragStart,
  ]);

  // ---------- YEAR VIEW ----------
  const renderYearView = useCallback(() => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

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
                            color: service.color ?? "",
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
  }, [currentDate, reservations, services]);

  return { renderMonthView, renderWeekView, renderYearView };
}
