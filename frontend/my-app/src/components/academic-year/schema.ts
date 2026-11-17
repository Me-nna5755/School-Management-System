import { z } from "zod";

export const academicYearSchema = z
  .object({
    name: z.string().min(1, "Year name is required"),
    fromYear: z.date({ error: "Start date is required" }),
    toYear: z.date({ error: "End date is required" }),
    isCurrent: z.boolean(),
  })
  .refine((data) => data.toYear >= data.fromYear, {
    message: "End date must be after or equal to start date",
    path: ["toYear"],
  });

export type AcademicYearFormValues = z.infer<typeof academicYearSchema>;
