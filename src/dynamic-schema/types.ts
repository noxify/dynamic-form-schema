import type { z } from "zod"

export type BaseFormValues = Record<string, unknown>

export type ZodValidator = z.ZodTypeAny
export type ZodValidatorFactory = () => z.ZodTypeAny
export type BaseStatus = "create" | "update"

export type FieldValidations = Record<string, ZodValidator | ZodValidatorFactory>

export type BaseValidationType = "string" | "number" | "boolean" | "none" | "anyOptional"

export interface AsyncClientValidationProps<
  TFormValues extends Record<string, unknown> = BaseFormValues,
> {
  value: unknown
  values?: TFormValues
}

export interface AsyncServerValidationProps<
  TFormValues extends Record<string, unknown> = BaseFormValues,
> {
  value: unknown
  values?: TFormValues
}

export interface FieldConfig<
  TFormValues extends Record<string, unknown> = BaseFormValues,
  TValidationKey extends string = BaseValidationType,
> {
  visible: boolean
  required?: boolean | ((values: TFormValues) => boolean)
  disabled?: boolean | ((values: TFormValues) => boolean)
  defaultValue?: string | number | boolean | null
  validation?: TValidationKey | ((values: TFormValues) => TValidationKey)
  allowEmpty?: boolean
  asyncClientValidation?: (
    props: AsyncClientValidationProps<TFormValues>,
  ) => Promise<string | undefined>
  asyncServerValidation?: (
    props: AsyncServerValidationProps<TFormValues>,
  ) => Promise<string | undefined>
}

export type FormConfig<
  TFormValues extends Record<string, unknown> = BaseFormValues,
  TValidationKey extends string = BaseValidationType,
  TStatus extends string = BaseStatus,
> = Partial<
  Record<
    TStatus,
    {
      fields: Record<string, FieldConfig<TFormValues, TValidationKey>>
    }
  >
>
