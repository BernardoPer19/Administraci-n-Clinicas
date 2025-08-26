"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { getPatients } from "@/src/server/patient/patient-actions";
import { getServices } from "@/src/server/services/services-actions";
import { addReservation } from "@/src/server/reservations/reservations-actions";

interface AddReservationDialogProps {
  children: React.ReactNode;
  selectedDate?: Date;
  selectedTime?: string;
}

export function AddReservationDialog({
  children,
  selectedDate,
  selectedTime,
}: AddReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    serviceId: "",
    date: "",
    time: "",
    status: "PENDING" as const,
    origin: "SYSTEM" as const,
    notes: "",
  });
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);
  const [services, setServices] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      async function fetchData() {
        const patientsData = await getPatients();
        const servicesData = await getServices();
        setPatients(patientsData);
        setServices(servicesData);
      }
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (open && selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        date: dateString,
        time: selectedTime || prev.time,
      }));
    }
  }, [open, selectedDate, selectedTime]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await addReservation({
        patientId: formData.patientId,
        serviceId: formData.serviceId,
        date: new Date(formData.date),
        time: formData.time,
        status: formData.status,
        origin: formData.origin,
        notes: formData.notes || undefined,
      });

      setFormData({
        patientId: "",
        serviceId: "",
        date: "",
        time: "",
        status: "PENDING",
        origin: "SYSTEM",
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error creando reserva:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-sans">Nueva Reserva</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient" className="font-serif">
                Paciente
              </Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, patientId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="font-serif">
                Servicio
              </Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.price} Bs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="font-serif">
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="font-serif">
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-serif">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                  <SelectItem value="COMPLETED">Completada</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-serif">Origen</Label>
              <Select
                value={formData.origin}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, origin: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SYSTEM">Sistema</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-serif">
              Notas
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="font-sans" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
