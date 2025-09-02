import type { Entries } from "type-fest"

import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form"
import { BaseFormValues, BaseValidationType, FieldConfig } from "./types"

export function typedSubmit<T extends FieldValues>(
  form: UseFormReturn<T>,
  onSubmit: SubmitHandler<T>,
) {
  return form.handleSubmit(onSubmit)
}

/**
 * Determines if a field is required based on its configuration and current form values.
 *
 * @template TFormValues - The type representing the form values.
 * @template TValidationKey - The type representing the validation key.
 * @param fieldConfig - An optional record mapping field names to their configuration objects.
 * @param name - The name of the field to check.
 * @param values - The current form values.
 * @returns `true` if the field is required, otherwise `false`.
 */
export function isRequired<
  TFormValues extends Record<string, unknown> = BaseFormValues,
  TValidationKey extends string = BaseValidationType,
>(
  fieldConfig: Record<string, FieldConfig<TFormValues, TValidationKey>> | undefined,
  name: string,
  values: TFormValues,
): boolean {
  const config = fieldConfig?.[name]
  if (!config) return false
  const isRequired =
    typeof config.required === "function" ? config.required(values) : !!config.required

  return isRequired
}

/**
 * Determines whether a form field should be disabled based on its configuration and current form values.
 *
 * @template TFormValues - The type representing the form values, extending a record of string keys to unknown values.
 * @template TValidationKey - The type representing the validation key, extending string.
 * @param fieldConfig - An optional record mapping field names to their configuration objects.
 * @param name - The name of the field to check.
 * @param values - The current form values.
 * @returns `true` if the field is disabled according to its configuration; otherwise, `false`.
 */
export function isDisabled<
  TFormValues extends Record<string, unknown> = BaseFormValues,
  TValidationKey extends string = BaseValidationType,
>(
  fieldConfig: Record<string, FieldConfig<TFormValues, TValidationKey>> | undefined,
  name: string,
  values: TFormValues,
): boolean {
  const config = fieldConfig?.[name]
  if (!config) return false
  const isDisabled =
    typeof config.disabled === "function" ? config.disabled(values) : !!config.disabled

  return isDisabled
}

export function cleanupFormData<TReturnValue extends object = object>(
  data: Record<string, unknown>,
): TReturnValue {
  return Object.fromEntries(
    (Object.entries(data) as Entries<typeof data>).map(([key, value]) => [
      key,
      value === "" || value === null ? undefined : value,
    ]),
  ) as TReturnValue
}
