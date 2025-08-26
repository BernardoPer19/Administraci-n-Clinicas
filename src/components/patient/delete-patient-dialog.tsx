"use client";

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
import { deletePatient } from "@/src/server/patient/patient-actions";
import type { Patient } from "@prisma/client";

interface DeletePatientDialogProps {
  patient: Patient;
  children: React.ReactNode;
}

export function DeletePatientDialog({
  patient,
  children,
}: DeletePatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePatient(patient.id); // Server Action
      setOpen(false);
    } catch (error) {
      console.error("Error eliminando paciente:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-sans">Eliminar Paciente</DialogTitle>
          <DialogDescription className="font-serif">
            ¿Estás seguro de que deseas eliminar a {patient.name}? Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
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
