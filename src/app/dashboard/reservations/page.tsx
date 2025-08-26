import { ReservationsTable } from "@/src/components/reservations/reservations-table";
import { AddReservationDialog } from "@/src/components/reservations/add-reservation-dialog";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { getReservations } from "@/src/server/reservations/reservations-actions";
import { getPatients } from "@/src/server/patient/patient-actions";
import { getServices } from "@/src/server/services/services-actions";

export default async function ReservationsPage() {
  const patients = await getPatients();
  const services = await getServices();
  const reservations = await getReservations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-sans">
            Reservas
          </h1>
          <p className="text-muted-foreground font-serif">
            Gestiona todas las reservas de la clínica
          </p>
        </div>
        <AddReservationDialog>
          <Button className="font-sans">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
        </AddReservationDialog>
      </div>

      <ReservationsTable
        reservations={reservations}
        patients={patients}
        services={services}
      />
    </div>
  );
}
