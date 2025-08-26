"use server"

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"
import { reservationSchema, ReservationTypeZod } from "./reservations-schema"

const partialReservationSchema = reservationSchema.partial()

export const getReservations = async () => {
    return await prisma.reservation.findMany({
        orderBy: { date: "desc" },
        include: { patient: true, service: true },
    })
}

export const getReservationsByID = async (id: string) => {
    if (!id) throw new Error("ID de la reserva es requerido")

    const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: { patient: true, service: true },
    })

    if (!reservation) throw new Error("Reserva no encontrada")

    return reservation
}


export const addReservation = async (input: ReservationTypeZod) => {
    const data = reservationSchema.parse(input)

    const reservation = await prisma.reservation.create({
        data: {
            date: data.date,
            time: data.time,
            status: data.status,
            origin: data.origin,
            notes: data.notes,
            patientId: data.patientId,
            serviceId: data.serviceId,
        },
        include: { patient: true, service: true },
    })
    revalidatePath("/reservations")
    return reservation
}

export const updateReservation = async (id: string, input: unknown) => {
    if (!id) throw new Error("ID de la reserva es requerido")

    const data = partialReservationSchema.parse(input)

    const reservation = await prisma.reservation.update({
        where: { id },
        data,
        include: { patient: true, service: true },
    })
    revalidatePath("/reservations")
    return reservation
}

export const deleteReservation = async (id: string) => {
    if (!id) throw new Error("ID de la reserva es requerido")

    const reservation = await prisma.reservation.delete({
        where: { id },
    })
    revalidatePath("/reservations")
    return reservation
}
