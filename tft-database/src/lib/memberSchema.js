import { z } from "zod"

export const memberSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  idNumber: z.string().min(1, "ID number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"], "Please select gender"),
  
  // Contact Information
  mobilePhone1: z.string().min(1, "Mobile phone is required"),
  mobilePhone2: z.string().optional(),
  emailAddress: z.string().email("Invalid email").optional().or(z.literal("")),
  
  // Location Information - MAKE THESE OPTIONAL FOR NOW
  province: z.string().optional(),
  constituency: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  village: z.string().optional(),
  cluster: z.string().optional(),
  
  // Farm Information - MAKE THESE OPTIONAL FOR NOW
  farmType: z.string().optional(),
  farmName: z.string().optional(),
  farmSize: z.string().optional(),
})