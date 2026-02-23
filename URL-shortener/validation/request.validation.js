import { z } from 'zod' // libarary

// Make a validation Schema for all type fo Validation
export const signupPostReqBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(3)
});

export const loginPostReqBodySchema = z.object({
  email: z.email(),
  password: z.string().min(3),
})