"use client"

import type { AvailableStatus, AvailableValidationType, FormValues } from "@/validations/schema"
import { useEffect, useState } from "react"
import { createAction } from "@/actions/create-action"
import { AgeField } from "@/components/fields/age"
import { ConditionalFieldAField } from "@/components/fields/conditional-field-a"
import { ConditionalFieldBField } from "@/components/fields/conditional-field-b"
import { NameField } from "@/components/fields/name"
import { ToggleField } from "@/components/fields/toggle"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { dynamicSchema } from "@/dynamic-schema"
import { cleanupFormData, typedSubmit } from "@/dynamic-schema/form-helper"
import { uniqueBy } from "@/lib/unique-by"
import { fieldValidations } from "@/validations/rules"
import { schema as formConfig } from "@/validations/schema"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateForm() {
  const [currentSchema, setCurrentSchema] = useState<ReturnType<typeof dynamicSchema> | null>(null)

  const status = "create"

  const fieldConfig = formConfig[status]?.fields ?? {}

  const defaultValues: FormValues = {
    name: "",
    age: 0,
    toggle: false,
    conditional: {
      fieldA: "",
      fieldB: "",
    },
  }

  const form = useForm<FormValues, unknown, FormValues>({
    // @ts-expect-error TODO: seems to be a types issue with zodResolver or with our dynamicSchema function
    resolver: currentSchema ? zodResolver(currentSchema, {}, { mode: "async" }) : undefined,
    mode: "onBlur",
    defaultValues,
  })

  const watchedValues = form.watch("toggle")

  // calculate the schema after the form is initialized
  // This ensures that the schema is only generated once the form is ready
  // and avoids unnecessary re-renders
  // This is important to ensure that the schema is ready when the form is rendered
  // and that it reflects the current state of the form values.
  // This way, the schema can adapt to changes in the form values without causing
  useEffect(() => {
    // fetch the current schema based on the current form values
    // This ensures that the schema is only generated once the form is ready
    // here we're using the async client validations
    const newSchema = dynamicSchema<FormValues, AvailableValidationType, AvailableStatus>({
      status: "create",
      formConfig,
      values: cleanupFormData<FormValues>(form.getValues()),
      isClient: true,
      fieldValidations: fieldValidations,
    })
    setCurrentSchema(newSchema)
  }, [watchedValues, form])

  async function onSubmit(values: FormValues) {
    const response = await createAction(cleanupFormData(values))

    if (response.status === "success") {
      toast.success("Success", { description: "Record created successfully" })
      form.reset()
      form.clearErrors()
    } else if (response.status === "validation") {
      const formattedIssueFields = response.error.map((issue) => ({
        name: issue.path.join("."),
        error: true,
        message: issue.message,
      }))
      uniqueBy(formattedIssueFields, (e) => e.name).forEach((ele) => {
        form.setError(ele.name, { message: ele.message })
      })
    } else {
      toast.error("Something went wrong", {
        description: response.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={typedSubmit(form, onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-6 xl:col-span-2">
            <div className="space-y-4 overflow-visible pt-6">
              <NameField form={form} name="name" fieldConfig={fieldConfig} />
              <AgeField form={form} name="age" fieldConfig={fieldConfig} />
              <ToggleField form={form} name="toggle" fieldConfig={fieldConfig} />
              <ConditionalFieldAField
                form={form}
                name="conditional.fieldA"
                fieldConfig={fieldConfig}
              />
              <ConditionalFieldBField
                form={form}
                name="conditional.fieldB"
                fieldConfig={fieldConfig}
              />
            </div>
            <div className="flex items-center gap-2">
              {form.formState.isSubmitting ? (
                <Button disabled={true}>
                  <span>Creating...</span>
                </Button>
              ) : (
                <Button type="submit">Create</Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
