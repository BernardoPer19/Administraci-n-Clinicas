import { CalendarView } from "@/src/components/calendar/calendar-view";
import { getPatients } from "@/src/server/patient/patient-actions";
import { getReservations } from "@/src/server/reservations/reservations-actions";
import { getServices } from "@/src/server/services/services-actions";

export default async function CalendarPage() {
  const reservations = await getReservations();
  const patients = await getPatients();
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-sans">
          Calendario
        </h1>
        <p className="text-muted-foreground font-serif">
          Vista de calendario con todas las reservas
        </p>
      </div>

      <CalendarView
        reservations={reservations}
        patients={patients}
        services={services}
      />
    </div>
  );
}

// import { ClinicCalendar } from "@/src/components/calendar/calendar-view";
// import { getPatients } from "@/src/server/patient/patient-actions";
// import { getReservations } from "@/src/server/reservations/reservations-actions";
// import { getServices } from "@/src/server/services/services-actions";

// export default async function CalendarPage() {
//   const reservations = await getReservations();
//   const patients = await getPatients();
//   const services = await getServices();

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground font-sans">
//           Calendario
//         </h1>
//         <p className="text-muted-foreground font-serif">
//           Vista de calendario con todas las reservas
//         </p>
//       </div>

//       <ClinicCalendar
//         reservations={reservations}
//         patients={patients}
//         services={services}
//       />
//     </div>
//   );
// }
