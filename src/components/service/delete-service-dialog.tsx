"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Service } from "@prisma/client"
import { deleteService } from "@/src/server/services/services-actions"

interface DeleteServiceDialogProps {
  service: Service
  children: React.ReactNode
}

export function DeleteServiceDialog({ service, children }: DeleteServiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      await deleteService(service.id)
      setOpen(false)
    } catch (err: any) {
      setError(err.message ?? "Error al eliminar el servicio")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-sans">Eliminar Servicio</DialogTitle>
          <DialogDescription className="font-serif">
            ¿Estás seguro de que deseas eliminar el servicio "{service.name}"?
            {error && <span className="block mt-2 text-destructive">{error}</span>}
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
          >
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
