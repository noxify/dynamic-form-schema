import z from "zod"

export const nameValidation = z.string().min(3).max(255)
export const ageValidation = z.coerce.number().min(12)
export const conditionalFieldAValidation = z.enum(["option1", "option2", "option3"])
export const conditionalFieldBValidation = z.string().min(5)

export const fieldValidations = {
  nameValidation,
  ageValidation,
  conditionalFieldAValidation,
  conditionalFieldBValidation,
}
