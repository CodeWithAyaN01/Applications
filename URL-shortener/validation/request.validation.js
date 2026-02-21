import { z } from 'zod' // libarary

export const signupPostReqBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(3)
});