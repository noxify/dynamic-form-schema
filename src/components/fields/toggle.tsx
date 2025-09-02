import type { FieldConfig } from "@/dynamic-schema/types"
import type { AvailableValidationType, FormValues } from "@/validations/schema"
import type { z } from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { isDisabled, isRequired } from "@/dynamic-schema/form-helper"

import type { UseFormReturn } from "react-hook-form"

export function ToggleField({
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
          <FormLabel>Conditional - toggle {required ? "*" : ""}</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2 pt-2">
              {}
              <Switch
                data-fieldname={field.name}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  form.setValue("conditional.fieldA", "" as string, {
                    shouldTouch: true,
                  })
                  form.resetField("conditional.fieldA", {
                    defaultValue: "" as string,
                  })
                  form.setValue("conditional.fieldB", "" as string, {
                    shouldTouch: true,
                  })
                  form.resetField("conditional.fieldB", {
                    defaultValue: "" as string,
                  })
                }}
                disabled={disabled ? true : undefined}
              />
              <Label htmlFor={field.name}>Toggle to switch between conditional fields</Label>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
