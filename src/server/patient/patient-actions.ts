"use server"

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"
import { patientSchema } from "./patient-schemta"

const partialPatientSchema = patientSchema.partial()

export const getPatients = async () => {
    return await prisma.patient.findMany({
        orderBy: { createdAt: "desc" },
        include: { reservations: true }, // contar reservas asociadas
    })
}


export const getByID = async (id: string) => {
    if (!id) throw new Error("ID del paciente es requerido")

    return await prisma.patient.findUnique({
        where: { id },
        include: { reservations: true },
    })
}

export const addPatient = async (input: unknown) => {
    const data = patientSchema.parse(input)

    const patient = await prisma.patient.create({
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            age: data.age,
            observations: data.observations,
        },
    })
    revalidatePath("/patients")
    return patient
}

export const updatePatient = async (id: string, input: unknown) => {
    if (!id) throw new Error("ID del paciente es requerido")

    const data = partialPatientSchema.parse(input)

    const patient = await prisma.patient.update({
        where: { id },
        data,
    })
    revalidatePath("/patients")
    return patient
}

export const deletePatient = async (id: string) => {
    if (!id) throw new Error("ID del paciente es requerido")

    const reservations = await prisma.reservation.count({
        where: { patientId: id },
    })
    if (reservations > 0) {
        throw new Error("No se puede eliminar un paciente con reservas activas")
    }

    const patient = await prisma.patient.delete({
        where: { id },
    })
    revalidatePath("/patients")
    return patient
}
