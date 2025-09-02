"use server"

import { sleep } from "@/lib/sleep"

import type { AsyncServerValidationProps } from "../dynamic-schema/types"

export const nameRemoteValidation = async (props: AsyncServerValidationProps) => {
  if (props.value == "" || props.value == undefined) {
    return
  }

  // Simulate some server-side processing delay
  await sleep()

  const isValid = props.value?.toString().toLowerCase() !== "server"

  if (!isValid) {
    return "async server: Please use a different name"
  }

  return
}
