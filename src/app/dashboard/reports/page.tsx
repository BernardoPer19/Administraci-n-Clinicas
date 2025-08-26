import { ReportsView } from "@/src/components/reports/reports-view";
import { getReservations } from "@/src/server/reservations/reservations-actions";
import { getPatients } from "@/src/server/patient/patient-actions";
import { getServices } from "@/src/server/services/services-actions";

export default async function ReportsPage() {
  const patients = await getPatients();
  const services = await getServices();
  const reservations = await getReservations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-sans">
          Reportes
        </h1>
        <p className="text-muted-foreground font-serif">
          Análisis detallado y reportes de la clínica
        </p>
      </div>

      <ReportsView
        patients={patients}
        services={services}
        reservations={reservations}
      />
    </div>
  );
}

