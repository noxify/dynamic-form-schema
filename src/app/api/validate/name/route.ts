import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { sleep } from "@/lib/sleep"

const handler = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ valid: false, message: "No name provided." })
  }

  // Simulate some server-side processing delay
  await sleep()

  const valid = name.toLowerCase() !== "client"

  return NextResponse.json({
    valid: valid,
    message: !valid ? "async client: Please use a different name" : "",
  })
}

export { handler as GET }
