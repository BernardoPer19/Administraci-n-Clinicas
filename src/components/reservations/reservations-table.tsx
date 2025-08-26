"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { EditReservationDialog } from "./edit-reservation-dialog";
import { DeleteReservationDialog } from "./delete-reservation-dialog";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  MessageCircle,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { Reservation, Patient, Service } from "@prisma/client";
import { formatDate } from "@/src/utils/FormteData";

interface Props {
  reservations: (Reservation & { patient: Patient; service: Service })[];
  patients: Patient[];
  services: Service[];
}

export function ReservationsTable({ reservations, patients, services }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.patient.name.includes(searchTerm.toLowerCase()) ||
      reservation.service.name.includes(searchTerm.toLowerCase()) ||
      reservation.notes?.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;
    const matchesOrigin =
      originFilter === "all" || reservation.origin === originFilter;

    return matchesSearch && matchesStatus && matchesOrigin;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOriginIcon = (origin: string) =>
    origin === "WHATSAPP" ? (
      <MessageCircle className="h-4 w-4 text-green-600" />
    ) : (
      <Monitor className="h-4 w-4 text-blue-600" />
    );


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-serif"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmada</SelectItem>
            <SelectItem value="CANCELLED">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        <Select value={originFilter} onValueChange={setOriginFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Origen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ONLINE">Sistema</SelectItem>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.patient.name}</TableCell>
                <TableCell>{reservation.service.name}</TableCell>
                <TableCell>{formatDate(reservation.date)}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getOriginIcon(reservation.origin!)}
                    <span className="capitalize">{reservation.origin}</span>
                  </div>
                </TableCell>
                <TableCell>{reservation.service.price} Bs</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/reservations/${reservation.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <EditReservationDialog
                    reservation={reservation}
                    patients={patients}
                    services={services}
                  >
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </EditReservationDialog>
                  <DeleteReservationDialog reservation={reservation}>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteReservationDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
