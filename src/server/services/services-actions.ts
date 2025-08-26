"use server"

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"
import { serviceSchema } from "./services-schema"

const partialServiceSchema = serviceSchema.partial()

export const getServices = async () => {
  return await prisma.service.findMany({
    orderBy: { name: "desc" },
    include: { reservations: true }, // para contar reservas en el cliente
  })
}

export const getServiceByID = async (id: string) => {
  if (!id) throw new Error("ID del servicio es requerido")

  return await prisma.service.findUnique({
    where: { id },
    include: { reservations: true },
  })
}

export const addService = async (input: unknown) => {
  const data = serviceSchema.parse(input)

  const service = await prisma.service.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      color: data.color,
    },
  })
  revalidatePath("/services")
  return service
}

export const updateService = async (id: string, input: unknown) => {
  if (!id) {
    throw new Error("ID del servicio es requerido para actualizar")
  }

  const data = partialServiceSchema.parse(input)

  const service = await prisma.service.update({
    where: { id },
    data,
  })
  revalidatePath("/services")
  return service
}

export const deleteService = async (id: string) => {
  if (!id) {
    throw new Error("ID del servicio es requerido para eliminar")
  }

  const reservations = await prisma.reservation.count({
    where: { serviceId: id }
  })
  if (reservations > 0) {
    throw new Error("No se puede eliminar un servicio con reservas asociadas")
  }

  const service = await prisma.service.delete({
    where: { id },
  })
  revalidatePath("/services")
  return service
}
