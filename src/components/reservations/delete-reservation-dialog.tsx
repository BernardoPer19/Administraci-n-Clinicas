"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { deleteReservation } from "@/src/server/reservations/reservations-actions";
import { Reservation, Patient, Service } from "@prisma/client";

interface DeleteReservationDialogProps {
  reservation: Reservation & { patient: Patient; service: Service };
  children: React.ReactNode;
}

export function DeleteReservationDialog({
  reservation,
  children,
}: DeleteReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteReservation(reservation.id);
      setOpen(false);
    } catch (error) {
      console.error("Error eliminando reserva:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-sans">Eliminar Reserva</DialogTitle>
          <DialogDescription className="font-serif">
            ¿Estás seguro de que deseas eliminar la reserva de{" "}
            {reservation.patient.name} para {reservation.service.name} el{" "}
            {reservation.date.toLocaleDateString()} a {reservation.time}?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="font-sans"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
