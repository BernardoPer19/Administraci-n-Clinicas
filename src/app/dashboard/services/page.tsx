import { ServicesTable } from "@/src/components/service/services-table";
import { AddServiceDialog } from "@/src/components/service/add-service-dialog";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { getServices } from "@/src/server/services/services-actions";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-sans">
            Servicios
          </h1>
          <p className="text-muted-foreground font-serif">
            Gestiona los servicios de tu clínica
          </p>
        </div>
        <AddServiceDialog>
          <Button className="font-sans">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </AddServiceDialog>
      </div>

      <ServicesTable services={services} />
    </div>
  );
}
