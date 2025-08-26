import { notFound } from "next/navigation";
import { db } from "@/src/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Monitor,
} from "lucide-react";
import Link from "next/link";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { id } = await params;
  const patient = db.patients.findById(id);

  if (!patient) {
    notFound();
  }

  const reservations = db.reservations.findByPatient(id);
  const services = db.services.findAll();

  const completedReservations = reservations.filter(
    (r) => r.status === "completed"
  ).length;
  const totalSpent = reservations
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => {
      const service = services.find((s) => s.id === r.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/patients">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground font-sans">
            {patient.name}
          </h1>
          <p className="text-muted-foreground font-serif">
            Perfil completo del paciente
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/patients/${id}/edit`}>Editar Paciente</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-sans">
                  Total Reservas
                </p>
                <p className="text-2xl font-bold font-sans">
                  {reservations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-sans">
                  Completadas
                </p>
                <p className="text-2xl font-bold font-sans">
                  {completedReservations}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Bs
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground font-sans">
                  Total Gastado
                </p>
                <p className="text-2xl font-bold font-sans">{totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="font-sans text-emerald-700 dark:text-emerald-400">
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium font-sans">Teléfono</p>
                  <p className="font-serif">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium font-sans">Email</p>
                  <p className="font-serif">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium font-sans">Edad</p>
                  <p className="font-serif">{patient.age} años</p>
                </div>
              </div>
            </div>
            {patient.observations && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
                <h4 className="font-medium mb-2 font-sans text-amber-800 dark:text-amber-400">
                  Observaciones
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-serif leading-relaxed">
                  {patient.observations}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="font-sans text-blue-700 dark:text-blue-400">
              Historial de Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-serif">
                  No hay reservas registradas
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  asChild
                >
                  <Link href="/dashboard/reservations">
                    Crear primera reserva
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reservations
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((reservation) => {
                    const service = services.find(
                      (s) => s.id === reservation.serviceId
                    );
                    return (
                      <div
                        key={reservation.id}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: service?.color }}
                              />
                              <p className="font-medium font-serif">
                                {service?.name}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground font-serif">
                              {reservation.date.toLocaleDateString("es-ES", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              - {reservation.time}
                            </p>
                            {reservation.notes && (
                              <p className="text-xs text-muted-foreground mt-1 font-serif italic">
                                {reservation.notes.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              className={`font-sans text-xs ${
                                reservation.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : reservation.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                  : reservation.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              }`}
                            >
                              {reservation.status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {reservation.origin === "whatsapp" ? (
                                <MessageCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                              ) : (
                                <Monitor className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              )}
                              <span className="text-xs text-muted-foreground font-serif">
                                {reservation.origin}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t">
                          <span className="text-sm font-semibold font-sans text-emerald-600 dark:text-emerald-400">
                            {service?.price} Bs
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/reservations/${reservation.id}`}
                            >
                              Ver detalles
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
