import { db } from "./db"

export interface AIResponse {
  content: string
  suggestions?: string[]
}

export class ClinicAI {
  private patients = db.patients.findAll()
  private services = db.services.findAll()
  private reservations = db.reservations.findAll()

  generateResponse(userMessage: string): AIResponse {
    const message = userMessage.toLowerCase()

    // Analytics queries
    if (this.isAnalyticsQuery(message)) {
      return this.handleAnalyticsQuery(message)
    }

    // Reservation queries
    if (this.isReservationQuery(message)) {
      return this.handleReservationQuery(message)
    }

    // Patient queries
    if (this.isPatientQuery(message)) {
      return this.handlePatientQuery(message)
    }

    // Service queries
    if (this.isServiceQuery(message)) {
      return this.handleServiceQuery(message)
    }

    // Default response
    return this.getDefaultResponse()
  }

  private isAnalyticsQuery(message: string): boolean {
    const analyticsKeywords = ["ingresos", "ganancia", "estadísticas", "resumen", "análisis", "reporte"]
    return analyticsKeywords.some((keyword) => message.includes(keyword))
  }

  private isReservationQuery(message: string): boolean {
    const reservationKeywords = ["reservas", "citas", "agenda", "calendario", "horario"]
    return reservationKeywords.some((keyword) => message.includes(keyword))
  }

  private isPatientQuery(message: string): boolean {
    const patientKeywords = ["pacientes", "clientes", "personas"]
    return patientKeywords.some((keyword) => message.includes(keyword))
  }

  private isServiceQuery(message: string): boolean {
    const serviceKeywords = ["servicios", "tratamientos", "procedimientos", "popular", "solicitado"]
    return serviceKeywords.some((keyword) => message.includes(keyword))
  }

  private handleAnalyticsQuery(message: string): AIResponse {
    const totalRevenue = this.calculateTotalRevenue()
    const monthlyRevenue = this.calculateMonthlyRevenue()
    const completedReservations = this.reservations.filter((r) => r.status === "completed").length

    return {
      content: `📊 Análisis de tu clínica: Ingresos totales: ${totalRevenue} Bs, Este mes: ${monthlyRevenue} Bs, Servicios completados: ${completedReservations}, Tasa de éxito: ${Math.round((completedReservations / this.reservations.length) * 100)}%`,
      suggestions: ["¿Cuál es mi mejor servicio?", "Mostrar tendencias mensuales", "¿Cómo mejorar mis ingresos?"],
    }
  }

  private handleReservationQuery(message: string): AIResponse {
    if (message.includes("hoy")) {
      return this.getTodayReservations()
    }

    if (message.includes("semana")) {
      return this.getWeekReservations()
    }

    if (message.includes("pendientes")) {
      return this.getPendingReservations()
    }

    return {
      content: `Tienes ${this.reservations.length} reservas en total. ${this.reservations.filter((r) => r.status === "confirmed").length} confirmadas, ${this.reservations.filter((r) => r.status === "pending").length} pendientes.`,
      suggestions: ["¿Cuántas reservas tengo hoy?", "Mostrar reservas pendientes", "¿Cuál es mi horario más ocupado?"],
    }
  }

  private handlePatientQuery(message: string): AIResponse {
    const newPatientsThisMonth = this.patients.filter((p) => {
      const createdDate = new Date(p.createdAt)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length

    return {
      content: `Tienes ${this.patients.length} pacientes registrados. Este mes se registraron ${newPatientsThisMonth} nuevos pacientes. El promedio de edad es ${Math.round(this.patients.reduce((sum, p) => sum + p.age, 0) / this.patients.length)} años.`,
      suggestions: [
        "¿Qué pacientes tienen citas pendientes?",
        "Mostrar pacientes más frecuentes",
        "¿Cómo contactar pacientes?",
      ],
    }
  }

  private handleServiceQuery(message: string): AIResponse {
    const serviceStats = this.services.map((service) => {
      const count = this.reservations.filter((r) => r.serviceId === service.id).length
      return { ...service, count }
    })
    serviceStats.sort((a, b) => b.count - a.count)

    const topService = serviceStats[0]

    return {
      content: `Tu servicio más popular es "${topService.name}" con ${topService.count} reservas (${topService.price} Bs c/u). Le siguen: ${serviceStats
        .slice(1, 3)
        .map((s) => `${s.name} (${s.count})`)
        .join(", ")}.`,
      suggestions: [
        "¿Cuánto he ganado con este servicio?",
        "¿Qué servicios necesitan promoción?",
        "Mostrar precios de servicios",
      ],
    }
  }

  private getTodayReservations(): AIResponse {
    const today = new Date()
    const todayReservations = this.reservations.filter((r) => r.date.toDateString() === today.toDateString())

    if (todayReservations.length === 0) {
      return {
        content:
          "No tienes reservas programadas para hoy. ¡Es un buen momento para ponerte al día con tareas administrativas!",
        suggestions: [
          "¿Cuántas reservas tengo mañana?",
          "Mostrar reservas de la semana",
          "¿Cómo promocionar mis servicios?",
        ],
      }
    }

    const nextReservations = todayReservations.slice(0, 3).map((r) => {
      const patient = this.patients.find((p) => p.id === r.patientId)
      const service = this.services.find((s) => s.id === r.serviceId)
      return `${patient?.name} - ${service?.name} a las ${r.time}`
    })

    return {
      content: `Hoy tienes ${todayReservations.length} reservas: ${nextReservations.join(", ")}${todayReservations.length > 3 ? ` y ${todayReservations.length - 3} más` : ""}.`,
      suggestions: ["¿Cuánto voy a ganar hoy?", "Mostrar detalles de las citas", "¿Tengo tiempo libre hoy?"],
    }
  }

  private getWeekReservations(): AIResponse {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekReservations = this.reservations.filter((r) => r.date >= weekStart && r.date <= weekEnd)

    return {
      content: `Esta semana tienes ${weekReservations.length} reservas programadas. Distribución: ${this.getWeekDistribution(weekReservations)}`,
      suggestions: ["¿Qué día es el más ocupado?", "¿Puedo agendar más citas?", "Mostrar ingresos de la semana"],
    }
  }

  private getPendingReservations(): AIResponse {
    const pendingReservations = this.reservations.filter((r) => r.status === "pending")

    if (pendingReservations.length === 0) {
      return {
        content: "¡Excelente! No tienes reservas pendientes de confirmación. Todas tus citas están organizadas.",
        suggestions: [
          "¿Cuántas reservas confirmadas tengo?",
          "Mostrar próximas citas",
          "¿Cómo conseguir más reservas?",
        ],
      }
    }

    return {
      content: `Tienes ${pendingReservations.length} reservas pendientes de confirmación. Es importante contactar a estos pacientes pronto para confirmar sus citas.`,
      suggestions: [
        "¿Cómo contactar a estos pacientes?",
        "Mostrar detalles de reservas pendientes",
        "¿Cuánto tiempo tengo para confirmar?",
      ],
    }
  }

  private getWeekDistribution(weekReservations: any[]): string {
    const distribution = weekReservations.reduce((acc: any, r) => {
      const day = r.date.toLocaleDateString("es", { weekday: "short" })
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {})

    return Object.entries(distribution)
      .map(([day, count]) => `${day}: ${count}`)
      .join(", ")
  }

  private calculateTotalRevenue(): number {
    return this.reservations
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => {
        const service = this.services.find((s) => s.id === r.serviceId)
        return sum + (service?.price || 0)
      }, 0)
  }

  private calculateMonthlyRevenue(): number {
    const now = new Date()
    return this.reservations
      .filter(
        (r) =>
          r.status === "completed" &&
          r.date.getMonth() === now.getMonth() &&
          r.date.getFullYear() === now.getFullYear(),
      )
      .reduce((sum, r) => {
        const service = this.services.find((s) => s.id === r.serviceId)
        return sum + (service?.price || 0)
      }, 0)
  }

  private getDefaultResponse(): AIResponse {
    const responses = [
      {
        content:
          "Puedo ayudarte con información sobre reservas, pacientes, servicios y estadísticas de tu clínica. ¿Qué te gustaría saber?",
        suggestions: ["¿Cuántas reservas tengo hoy?", "¿Cuál es mi servicio más popular?", "Mostrar ingresos del mes"],
      },
      {
        content:
          "Estoy aquí para ayudarte a gestionar mejor tu clínica. Puedo darte información detallada sobre cualquier aspecto de tu negocio.",
        suggestions: [
          "Mostrar estadísticas generales",
          "¿Cuál es mi mejor día de la semana?",
          "¿Cómo van mis ingresos?",
        ],
      },
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }
}
