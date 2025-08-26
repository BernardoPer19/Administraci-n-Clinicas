import { NextResponse } from "next/server"
import { clearUser } from "@/src/lib/auth"

export async function POST() {
  try {
    await clearUser()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
