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
  
  // Location Information
  province: z.string().min(1, "Province is required"),
  constituency: z.string().min(1, "Constituency is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().optional(),
  village: z.string().optional(),
  cluster: z.string().optional(),
  
  // Farm Information
  farmType: z.enum(["communal", "a1", "a2", "small_scale_resettlement", "commercial"], 
    "Please select farm type"),
  farmName: z.string().optional(),
  farmSize: z.string().min(1, "Farm size is required"),
})