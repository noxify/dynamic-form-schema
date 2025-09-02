import type { FieldConfig } from "@/dynamic-schema/types"
import type { AvailableValidationType, FormValues } from "@/validations/schema"
import type { z } from "zod"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { isDisabled, isRequired } from "@/dynamic-schema/form-helper"

import type { UseFormReturn } from "react-hook-form"

export function NameField({
  form,
  name,
  fieldConfig,
}: {
  form: UseFormReturn<z.infer<z.ZodAny>>
  name: string
  fieldConfig?: Record<string, FieldConfig<FormValues, AvailableValidationType>>
}) {
  if (!fieldConfig?.[name]?.visible) {
    return null
  }

  const values = form.getValues() as FormValues
  const required = isRequired(fieldConfig, name, values)
  const disabled = isDisabled(fieldConfig, name, values)

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled ? true : undefined}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name {required ? "*" : ""}</FormLabel>
          <FormControl>
            <Input placeholder="Enter your name" {...field} data-fieldname={field.name} />
          </FormControl>

          <FormDescription>
            Use value <kbd className="font-bold">client</kbd> to trigger the async client
            validation. <br /> Use value <kbd className="font-bold">server</kbd> to trigger the
            async server validation on submit.
          </FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
