import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/create">Create form</Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link href="/update">Update form</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
