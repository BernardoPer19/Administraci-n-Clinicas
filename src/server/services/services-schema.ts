import { z } from "zod"

export const serviceSchema = z.object({
  id: z.string().cuid().optional(), // cuid como en Prisma
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  description: z.string().max(500).optional(),
  color: z.string().max(50).optional(),
  createdAt: z.date().optional(), // Prisma lo maneja automático
})

export type ServiceTypeZod = z.infer<typeof serviceSchema>

export const validateServices = (input: unknown): ServiceTypeZod => {
  const result = serviceSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}
