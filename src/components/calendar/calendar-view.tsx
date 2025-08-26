"use client";

import type React from "react";
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
import { Reservation, Patient, Service } from "@prisma/client";

type ViewType = "month" | "week" | "year";

interface Props {
  reservations: Reservation[];
  patients: Patient[];
  services: Service[];
}

export function CalendarView({ reservations, patients, services }: Props) {

  const { handleDragStart, handleDragOver, handleDrop } = useDragDropCalendar();

  const {
    renderMonthView,
    renderWeekView,
    renderYearView,
    formatDateRange,
    navigateDate,
    setCurrentDate,
    setViewType,
    viewType,
  } = useCalendarViews({
    handleDragStart,
    handleDragOver,
    handleDrop,
    reservations,
    patients,
    services,
  });

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

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert("Funcionalidad de exportación en desarrollo");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      {/* Vistas del calendario */}
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

// "use client";
// import React, { useState, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import listPlugin from "@fullcalendar/list";
// import { Button } from "@/src/components/ui/button";
// import type {
//   EventInput,
//   EventClickArg,
//   EventDropArg,
//   DateSelectArg,
// } from "@fullcalendar/core";
// import { Reservation, Patient, Service } from "@prisma/client";
// import {
//   Plus,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight,
//   Download,
// } from "lucide-react";
// import { AddReservationDialog } from "../reservations/add-reservation-dialog";

// interface ClinicCalendarProps {
//   reservations: Reservation[];
//   patients: Patient[];
//   services: Service[];
// }

// export const ClinicCalendar: React.FC<ClinicCalendarProps> = ({
//   reservations,
//   patients,
//   services,
// }) => {
//   const calendarRef = useRef<FullCalendar>(null);
//   const [currentView, setCurrentView] = useState<
//     "dayGridMonth" | "timeGridWeek" | "listYear"
//   >("dayGridMonth");

//   // Convertir reservas a eventos
//   const events: EventInput[] = reservations.map((r) => {
//     const patient = patients.find((p) => p.id === r.patientId);
//     const service = services.find((s) => s.id === r.serviceId);

//     return {
//       id: r.id,
//       title: `${patient?.name} - ${service?.name} (${r.time})`,
//       start: `${r.date}T${r.time}`,
//       backgroundColor: service?.color + (r.origin === "WHATSAPP" ? "60" : "40"),
//       borderColor: service?.color,
//     };
//   });

//   const handleDateSelect = (selectInfo: DateSelectArg) => {
//     // alert(`Crear nueva reserva el ${selectInfo.startStr}`);
//     <AddReservationDialog>
//       <Button size="sm" className="font-sans">
//         <Plus className="h-4 w-4 mr-2" />
//         Nueva Reserva
//       </Button>
//     </AddReservationDialog>;
//   };

//   const handleEventDrop = (dropInfo: EventDropArg) => {
//     alert(
//       `Actualizar fecha de la reserva ${dropInfo.event.title} a ${dropInfo.event.start}`
//     );
//   };

//   const handleEventClick = (clickInfo: EventClickArg) => {
//     alert(`Clicked: ${clickInfo.event.title}`);
//   };

//   const handlePrev = () => calendarRef.current?.getApi().prev();
//   const handleNext = () => calendarRef.current?.getApi().next();
//   const handleToday = () => calendarRef.current?.getApi().today();
//   const handleExport = () => alert("Exportar calendario");

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" onClick={handlePrev}>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" size="sm" onClick={handleToday}>
//             Hoy
//           </Button>
//           <Button variant="outline" size="sm" onClick={handleNext}>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button size="sm" onClick={() => alert("Agregar nueva reserva")}>
//             <Plus className="h-4 w-4 mr-2" /> Nueva Reserva
//           </Button>
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={() => alert("Agregar nuevo paciente")}
//           >
//             <UserPlus className="h-4 w-4 mr-2" /> Nuevo Paciente
//           </Button>
//           <Button size="sm" variant="outline" onClick={handleExport}>
//             <Download className="h-4 w-4 mr-2" /> Exportar
//           </Button>
//         </div>
//       </div>

//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
//         headerToolbar={false}
//         initialView={currentView}
//         views={{
//           dayGridMonth: { buttonText: "Mes" },
//           timeGridWeek: { buttonText: "Semana" },
//           listYear: { buttonText: "Año" },
//         }}
//         events={events}
//         editable
//         selectable
//         selectMirror
//         dayMaxEvents
//         select={handleDateSelect}
//         eventClick={handleEventClick}
//         eventDrop={handleEventDrop}
//       />

//       <div className="flex gap-2 mt-2">
//         <Button size="sm" onClick={() => setCurrentView("dayGridMonth")}>
//           Mes
//         </Button>
//         <Button size="sm" onClick={() => setCurrentView("timeGridWeek")}>
//           Semana
//         </Button>
//         <Button size="sm" onClick={() => setCurrentView("listYear")}>
//           Año
//         </Button>
//       </div>
//     </div>
//   );
// };
