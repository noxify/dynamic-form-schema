"use server"

import type { AvailableStatus, AvailableValidationType, FormValues } from "@/validations/schema"
import type { core } from "zod"
import { dynamicSchema } from "@/dynamic-schema"
import { cleanupFormData } from "@/dynamic-schema/form-helper"
import { fieldValidations } from "@/validations/rules"
import { schema as formConfig } from "@/validations/schema"

export type State = {
  status: "success"
  message: string
} | null

type ActionResponse =
  | {
      status: "success"
    }
  | { status: "error"; message: string }
  | { status: "validation"; error: core.$ZodIssue[] }

export async function createAction(formData: FormValues): Promise<ActionResponse> {
  const status = "create"

  const cleanedFormData = cleanupFormData<FormValues>(formData)

  const validation = dynamicSchema<FormValues, AvailableValidationType, AvailableStatus>({
    formConfig,
    isClient: false,

    fieldValidations,
    values: cleanedFormData,
    status,
  })

  const validatedFormData = await validation.safeParseAsync(cleanedFormData)

  if (!validatedFormData.success) {
    return {
      status: "validation",
      error: validatedFormData.error.issues,
    }
  }

  try {
    // run your server action here to create the record
    // you have access to the validated form data via `validatedFormData.data`
    return {
      status: "success",
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      status: "error",
      message: "Something went wrong",
    }
  }
}
