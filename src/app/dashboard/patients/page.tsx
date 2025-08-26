import { PatientsTable } from "@/src/components/patient/patients-table";
import { AddPatientDialog } from "@/src/components/patient/add-patient-dialog";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { getPatients } from "@/src/server/patient/patient-actions";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-sans">
            Pacientes
          </h1>
          <p className="text-muted-foreground font-serif">
            Gestiona la información de tus pacientes
          </p>
        </div>
        <AddPatientDialog>
          <Button className="font-sans">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        </AddPatientDialog>
      </div>

      <PatientsTable patients={patients} />
    </div>
  );
}
