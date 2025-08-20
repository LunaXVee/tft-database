import { z } from "zod"

export const clusterLeaderSchema = z.object({
  // Leader Information
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  clusterName: z.string().min(1, "Cluster name is required"),
  yearAppointed: z.string().min(1, "Year appointed is required"),
  
  // Contact Information
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  
  // Location Information
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().optional(),
  village: z.string().optional(),
  
  // Deputy Leader Information
  deputyName: z.string().optional(),
  deputyPhone: z.string().optional(),
  deputyEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  
  // Secretary Information
  secretaryName: z.string().optional(),
  secretaryPhone: z.string().optional(),
  secretaryEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  
  // Treasurer Information
  treasurerName: z.string().optional(),
  treasurerPhone: z.string().optional(),
  treasurerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  
  // Additional Information
  about: z.string().optional(),
})