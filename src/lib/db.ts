export interface Patient {
  id: string
  name: string
  phone: string
  email: string
  age: number
  createdAt: Date
  observations?: string
}

export interface Service {
  id: string
  name: string
  price: number
  description: string
  color: string
}

export interface Reservation {
  id: string
  patientId: string
  serviceId: string
  date: Date
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  origin: "whatsapp" | "system"
  notes?: string
  createdAt: Date
}

// Mock data storage (in production, this would be a real database)
const patients: Patient[] = [
  {
    id: "1",
    name: "María González",
    phone: "+591 70123456",
    email: "maria@email.com",
    age: 35,
    createdAt: new Date("2024-01-15"),
    observations: "Paciente regular, historial de ortodoncia",
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    phone: "+591 71234567",
    email: "carlos@email.com",
    age: 28,
    createdAt: new Date("2024-02-10"),
  },
]

const services: Service[] = [
  {
    id: "1",
    name: "Limpieza Dental",
    price: 150,
    description: "Limpieza profunda y revisión general",
    color: "#10b981",
  },
  {
    id: "2",
    name: "Ortodoncia",
    price: 800,
    description: "Consulta y tratamiento ortodóntico",
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Extracción",
    price: 200,
    description: "Extracción de piezas dentales",
    color: "#ef4444",
  },
]

const reservations: Reservation[] = [
  {
    id: "1",
    patientId: "1",
    serviceId: "1",
    date: new Date("2024-12-28"),
    time: "09:00",
    status: "confirmed",
    origin: "system",
    createdAt: new Date("2024-12-20"),
  },
  {
    id: "2",
    patientId: "2",
    serviceId: "2",
    date: new Date("2024-12-29"),
    time: "14:30",
    status: "pending",
    origin: "whatsapp",
    notes: "Paciente contactó por WhatsApp",
    createdAt: new Date("2024-12-21"),
  },
]

// Database operations
export const db = {
  // Patients
  patients: {
    findAll: () => patients,
    findById: (id: string) => patients.find((p) => p.id === id),
    create: (patient: Omit<Patient, "id" | "createdAt">) => {
      const newPatient: Patient = {
        ...patient,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      patients.push(newPatient)
      return newPatient
    },
    update: (id: string, updates: Partial<Patient>) => {
      const index = patients.findIndex((p) => p.id === id)
      if (index !== -1) {
        patients[index] = { ...patients[index], ...updates }
        return patients[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = patients.findIndex((p) => p.id === id)
      if (index !== -1) {
        patients.splice(index, 1)
        return true
      }
      return false
    },
  },

  // Services
  services: {
    findAll: () => services,
    findById: (id: string) => services.find((s) => s.id === id),
    create: (service: Omit<Service, "id">) => {
      const newService: Service = {
        ...service,
        id: Date.now().toString(),
      }
      services.push(newService)
      return newService
    },
    update: (id: string, updates: Partial<Service>) => {
      const index = services.findIndex((s) => s.id === id)
      if (index !== -1) {
        services[index] = { ...services[index], ...updates }
        return services[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = services.findIndex((s) => s.id === id)
      if (index !== -1) {
        services.splice(index, 1)
        return true
      }
      return false
    },
  },

  // Reservations
  reservations: {
    findAll: () => reservations,
    findById: (id: string) => reservations.find((r) => r.id === id),
    findByPatient: (patientId: string) => reservations.filter((r) => r.patientId === patientId),
    create: (reservation: Omit<Reservation, "id" | "createdAt">) => {
      const newReservation: Reservation = {
        ...reservation,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      reservations.push(newReservation)
      return newReservation
    },
    update: (id: string, updates: Partial<Reservation>) => {
      const index = reservations.findIndex((r) => r.id === id)
      if (index !== -1) {
        reservations[index] = { ...reservations[index], ...updates }
        return reservations[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = reservations.findIndex((r) => r.id === id)
      if (index !== -1) {
        reservations.splice(index, 1)
        return true
      }
      return false
    },
  },
}
