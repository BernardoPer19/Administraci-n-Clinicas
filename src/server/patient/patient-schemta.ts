import { z } from "zod"

export const patientSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1).max(100),
  phone: z.string().min(6).max(20), // validación básica
  age: z.number().int().positive().max(120),
  email: z.string().email(),
  observations: z.string().max(500).optional(),
  createdAt: z.date().optional(),
})

export type PatientTypeZod = z.infer<typeof patientSchema>

export const validatePatient = (input: unknown): PatientTypeZod => {
  const result = patientSchema.safeParse(input)
  if (!result.success) throw result.error
  return result.data
}
