"use client"

import { AsyncClientValidationProps } from "@/dynamic-schema/types"

export const nameRemoteValidation = async (props: AsyncClientValidationProps) => {
  if (props.value == "" || props.value == undefined) {
    return
  }
  // @TODO: Check if there is another way to do this.
  //        maybe we could use a server action for this?
  const res = await fetch(`/api/validate/name?name=${props.value as string}`)

  const body = (await res.json()) as { valid: boolean; message: string }

  if (!body.valid) {
    return body.message
  }

  return
}
