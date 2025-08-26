import { db } from "@/src/lib/db";
import { Service } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { EditServiceDialog } from "@/src/components/service/edit-service-dialog";
import { DeleteServiceDialog } from "@/src/components/service/delete-service-dialog";
import { Edit, Trash2 } from "lucide-react";

interface Props {
  services: Service[];
}

export async function ServicesTable({ services }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Servicio</TableHead>
              <TableHead className="font-sans">Descripción</TableHead>
              <TableHead className="font-sans">Precio</TableHead>
              <TableHead className="font-sans">Color</TableHead>
              <TableHead className="font-sans">Reservas</TableHead>
              <TableHead className="font-sans">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => {
              const reservations = db.reservations
                .findAll()
                .filter((r) => r.serviceId === service.id);
              return (
                <TableRow key={service.id}>
                  <TableCell className="font-medium font-serif">
                    {service.name}
                  </TableCell>
                  <TableCell className="font-serif max-w-xs truncate">
                    {service.description}
                  </TableCell>
                  <TableCell className="font-serif">
                    {service.price} Bs
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: service.color ?? "" }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {service.color}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-sans">
                      {reservations.length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EditServiceDialog service={service}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditServiceDialog>
                      <DeleteServiceDialog service={service}>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DeleteServiceDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
