import { type NextRequest, NextResponse } from "next/server"
import { setUser } from "@/src/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple demo authentication
    if (email === "admin@clinica.com" && password === "admin123") {
      const user = {
        id: "1",
        email: "admin@clinica.com",
        name: "Dr. Admin",
      }

      await setUser(user)

      return NextResponse.json({ success: true, user })
    }

    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
