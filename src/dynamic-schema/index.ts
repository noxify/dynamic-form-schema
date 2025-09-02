import { z } from "zod"

import {
  BaseFormValues,
  BaseStatus,
  BaseValidationType,
  FieldValidations,
  FormConfig,
} from "./types"

/**
 * Transforms a flat object with dot-separated keys into a nested object structure,
 * wrapping each nested object with `z.object` from Zod.
 *
 * @param flatShape - An object whose keys may represent nested paths using dot notation.
 * @returns A nested object where each nested level is wrapped with `z.object`.
 *
 * @example
 * ```typescript
 * const flat = { "user.name": z.string(), "user.age": z.number() };
 * const nested = nestShape(flat);
 * // Result:
 * // {
 * //   user: z.object({
 * //     name: z.string(),
 * //     age: z.number()
 * //   })
 * // }
 * ```
 */
function nestShape(flatShape: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key in flatShape) {
    const parts = key.split(".")
    let curr = result
    for (let i = 0; i < parts.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const part = parts[i]!
      if (i === parts.length - 1) {
        curr[part] = flatShape[key]
      } else {
        if (typeof curr[part] !== "object" || curr[part] === null) {
          curr[part] = {}
        }
        curr = curr[part] as Record<string, unknown>
      }
    }
  }

  function wrapZod(obj: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    for (const key in obj) {
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key]) &&
        Object.getPrototypeOf(obj[key]) === Object.prototype
      ) {
        out[key] = z.object(wrapZod(obj[key] as Record<string, unknown>))
      } else {
        out[key] = obj[key]
      }
    }
    return out
  }

  return wrapZod(result)
}

/**
 * Generates a dynamic Zod schema for form validation based on the provided form configuration,
 * tenant, status, and other contextual parameters.
 *
 * The schema is constructed by iterating over the fields defined in the configuration for the
 * given tenant and status. Field visibility, requirement, disabled state, and validation type
 * are all dynamically determined, supporting both static values and functions that depend on
 * current form values.
 *
 * Supports both synchronous and asynchronous (client/server) validation for each field.
 *
 * @template TFormValues - The type of the form values.
 * @param params - The parameters for schema generation.
 * @param params.formConfig - The configuration object describing form fields and their validation.
 * @param params.tenantId - The tenant identifier used to select the correct form configuration.
 * @param params.status - The current status used to select the correct form configuration.
 * @param params.t - The translation function for error messages.
 * @param params.values - (Optional) The current form values, used for dynamic validation logic.
 * @param params.isClient - Whether the schema is being generated on the client (enables client-side async validation).
 * @returns A Zod schema object representing the dynamic form validation rules.
 */
export function dynamicSchema<
  TFormValues extends Record<string, unknown> = BaseFormValues,
  TValidationKey extends string = BaseValidationType,
  TStatus extends string = BaseStatus,
>({
  formConfig,
  status,
  values,
  isClient,
  fieldValidations,
}: {
  formConfig: FormConfig<TFormValues, TValidationKey, TStatus>
  status: TStatus
  values?: TFormValues
  isClient: boolean
  fieldValidations: FieldValidations
}) {
  const config = formConfig[status] ?? null

  if (!config) {
    throw new Error(`No form configuration found for status: ${status}`)
  }

  const shape: Record<string, z.ZodTypeAny> = {}

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    if (!fieldConfig.visible) return

    const isDisabled =
      typeof fieldConfig.disabled === "function"
        ? values
          ? fieldConfig.disabled(values)
          : false
        : fieldConfig.disabled

    const isRequired =
      typeof fieldConfig.required === "function"
        ? values
          ? fieldConfig.required(values)
          : false
        : fieldConfig.required

    const validationType =
      typeof fieldConfig.validation === "function"
        ? values
          ? fieldConfig.validation(values)
          : undefined
        : fieldConfig.validation

    let fieldSchema: z.ZodTypeAny = z.any()

    if (isDisabled) {
      fieldSchema = z.any().optional()
    } else {
      if (
        validationType &&
        typeof validationType === "string" &&
        Object.prototype.hasOwnProperty.call(fieldValidations, validationType)
      ) {
        const validator = fieldValidations[validationType as keyof typeof fieldValidations]

        if (!validator) {
          throw new Error(`Validation type "${validationType}" not found in fieldValidations`)
        }

        fieldSchema = typeof validator === "function" ? validator() : validator
      } else if (validationType === "string") {
        fieldSchema = z.string()
      } else if (validationType === "number") {
        fieldSchema = z.number()
      } else if (validationType === "boolean") {
        fieldSchema = z.boolean().default(false)
      } else if (validationType === "anyOptional") {
        fieldSchema = z.any().optional()
      } else {
        fieldSchema = z.any()
      }

      if (fieldConfig.allowEmpty) {
        fieldSchema = fieldSchema.or(z.literal(""))
      }

      if (!isRequired) {
        fieldSchema = fieldSchema.optional()
      }

      if (isClient && typeof fieldConfig.asyncClientValidation === "function") {
        fieldSchema = fieldSchema.superRefine(async (value, ctx) => {
          const error = await fieldConfig.asyncClientValidation?.({ value, values })
          if (error) {
            ctx.addIssue({
              code: "custom",
              message: error,
            })
          }
        })
      }
      if (!isClient && typeof fieldConfig.asyncServerValidation === "function") {
        fieldSchema = fieldSchema.superRefine(async (value, ctx) => {
          const error = await fieldConfig.asyncServerValidation?.({
            value,
            values,
          })
          if (error) {
            ctx.addIssue({
              code: "custom",
              message: error,
            })
          }
        })
      }
    }

    shape[fieldName] = fieldSchema
  })

  const result = z.object(nestShape(shape))
  return result
}
