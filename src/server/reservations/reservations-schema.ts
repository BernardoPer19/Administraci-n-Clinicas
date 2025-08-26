import { z } from "zod"

export const reservationSchema = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(), // coerción desde string/Date
  time: z.string().min(1), 
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).default("PENDING"),
  origin: z.enum(["ONLINE", "IN_PERSON", "PHONE"]).optional(),
  notes: z.string().max(500).optional(),
  patientId: z.string().cuid(),
  serviceId: z.string().cuid(),
  createdAt: z.date().optional(),
})

export type ReservationTypeZod = z.infer<typeof reservationSchema>

export const validateReservation = (input: unknown): ReservationTypeZod => {
  const result = reservationSchema.safeParse(input)
  if (!result.success) throw result.error
  return result.data
}
