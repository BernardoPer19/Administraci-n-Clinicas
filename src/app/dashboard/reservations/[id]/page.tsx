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
  User,
  Briefcase,
  Calendar,
  MessageCircle,
  Monitor,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {  getReservationsByID } from "@/src/server/reservations/reservations-actions";

interface ReservationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailPage({
  params,
}: ReservationDetailPageProps) {
  const { id } = await params;
  const reservation = await getReservationsByID(id);

  if (!reservation) {
    notFound();
  }

  const patient = db.patients.findById(reservation.patientId);
  const service = db.services.findById(reservation.serviceId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/reservations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-sans">
            Detalles de Reserva
          </h1>
          <p className="text-muted-foreground font-serif">
            Información completa de la reserva #{reservation.id}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="font-sans flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <User className="h-5 w-5" />
              Información del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-semibold mb-1 font-sans text-lg">
                {patient?.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium font-sans">Teléfono:</span>
                  <span className="text-muted-foreground font-serif">
                    {patient?.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium font-sans">Email:</span>
                  <span className="text-muted-foreground font-serif">
                    {patient?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium font-sans">Edad:</span>
                  <span className="text-muted-foreground font-serif">
                    {patient?.age} años
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full bg-transparent"
            >
              <Link href={`/dashboard/patients/${patient?.id}`}>
                Ver perfil completo
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-l-4"
          style={{ borderLeftColor: service?.color }}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className="font-sans flex items-center gap-2"
              style={{ color: service?.color }}
            >
              <Briefcase className="h-5 w-5" />
              Servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-semibold mb-2 font-sans text-lg">
                {service?.name}
              </h4>
              <p className="text-muted-foreground font-serif text-sm mb-3">
                {service?.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: service?.color }}
                  />
                  <span className="text-xs font-mono text-muted-foreground">
                    {service?.color}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-sans text-emerald-600 dark:text-emerald-400">
                    {service?.price}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">Bs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="font-sans flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Calendar className="h-5 w-5" />
              Detalles de la Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium font-sans">Fecha:</span>
                <span className="text-muted-foreground font-serif">
                  {reservation.date.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium font-sans">Hora:</span>
                <span className="text-muted-foreground font-serif text-lg font-semibold">
                  {reservation.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium font-sans">Estado:</span>
                <Badge
                  className={`${getStatusColor(reservation.status)} font-sans`}
                >
                  {reservation.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium font-sans">Origen:</span>
                <div className="flex items-center gap-2">
                  {reservation.origin === "WHATSAPP" ? (
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <MessageCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-serif text-green-700 dark:text-green-300">
                        WhatsApp
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      <Monitor className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-serif text-blue-700 dark:text-blue-300">
                        Sistema
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {reservation.notes && (
          <Card className="md:col-span-2 lg:col-span-3 border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="font-sans flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <FileText className="h-5 w-5" />
                Notas Adicionales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-muted-foreground font-serif leading-relaxed">
                  {reservation.notes}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button asChild>
          <Link href={`/dashboard/reservations/${id}`}>Editar Reserva</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/calendar`}>Ver en Calendario</Link>
        </Button>
      </div>
    </div>
  );
}
