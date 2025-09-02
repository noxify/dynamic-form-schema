import type { FieldConfig } from "@/dynamic-schema/types"
import type { AvailableValidationType, FormValues } from "@/validations/schema"
import type { z } from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { isDisabled, isRequired } from "@/dynamic-schema/form-helper"

import type { UseFormReturn } from "react-hook-form"

export function ConditionalFieldAField({
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
      disabled={disabled ? true : undefined}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Conditional - Field A {required ? "*" : ""}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value as string | undefined}
              disabled={disabled ? true : undefined}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
