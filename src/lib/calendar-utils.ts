export function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

export function getWeekDays(date: Date) {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    weekDays.push(day)
  }

  return weekDays
}

export function isSameDay(date1: Date, date2: Date) {
  return date1.toDateString() === date2.toDateString()
}

export function formatDateRange(date: Date, viewType: "month" | "week" | "year") {
  if (viewType === "month") {
    return date.toLocaleDateString("es", { month: "long", year: "numeric" })
  } else if (viewType === "week") {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    return `${startOfWeek.toLocaleDateString("es", { day: "numeric", month: "short" })} - ${endOfWeek.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}`
  } else {
    return date.getFullYear().toString()
  }
}

export function exportToExcel(reservations: any[], patients: any[], services: any[]) {
  // Mock implementation - in production would use a library like xlsx
  const data = reservations.map((reservation) => {
    const patient = patients.find((p) => p.id === reservation.patientId)
    const service = services.find((s) => s.id === reservation.serviceId)

    return {
      Fecha: reservation.date.toLocaleDateString(),
      Hora: reservation.time,
      Paciente: patient?.name,
      Servicio: service?.name,
      Precio: service?.price,
      Estado: reservation.status,
      Origen: reservation.origin,
      Notas: reservation.notes || "",
    }
  })

  console.log("Exportando a Excel:", data)
  return data
}

export function exportToPDF(reservations: any[], patients: any[], services: any[]) {
  // Mock implementation - in production would use a library like pdfkit
  console.log("Exportando a PDF:", { reservations, patients, services })
}
