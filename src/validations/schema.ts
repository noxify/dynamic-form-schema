import { BaseFormValues, BaseStatus, BaseValidationType, FormConfig } from "../dynamic-schema/types"
import { nameRemoteValidation as nameRemoteClientValidation } from "./client-validations"
import { fieldValidations } from "./rules"
import { nameRemoteValidation as nameRemoteServerValidation } from "./server-validations"

export interface FormValues extends BaseFormValues {
  name: string
  age: number
  toggle: boolean
  conditional: {
    fieldA: string | null
    fieldB: string | null
  }
}

export type AvailableValidationType = BaseValidationType | keyof typeof fieldValidations
export type AvailableStatus = BaseStatus
export const schema: FormConfig<FormValues, AvailableValidationType, AvailableStatus> = {
  create: {
    fields: {
      name: {
        visible: true,
        required: true,
        validation: "nameValidation",
        asyncClientValidation: nameRemoteClientValidation,
        asyncServerValidation: nameRemoteServerValidation,
      },
      age: { visible: true, required: true, validation: "ageValidation" },
      toggle: { visible: true, required: false, validation: "boolean", disabled: false },
      "conditional.fieldA": {
        visible: true,
        required: (values) => values.toggle == false,
        disabled: (values) => values.toggle == true,
        validation: "conditionalFieldAValidation",
      },
      "conditional.fieldB": {
        visible: true,
        required: (values) => values.toggle == true,
        disabled: (values) => values.toggle == false,
        validation: "conditionalFieldBValidation",
      },
    },
  },
}
