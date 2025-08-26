"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { db } from "@/src/lib/db";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

export function ReportsView() {
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("revenue");

  const services = db.services.findAll();
  const patients = db.patients.findAll();
  const reservations = db.reservations.findAll();

  // Filter reservations based on date range
  const getFilteredReservations = () => {
    const now = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return reservations.filter((r) => r.date >= startDate);
  };

  const filteredReservations = getFilteredReservations();

  // Revenue by service
  const revenueByService = services.map((service) => {
    const serviceReservations = filteredReservations.filter(
      (r) => r.serviceId === service.id && r.status === "completed"
    );
    const revenue = serviceReservations.length * service.price;

    return {
      name: service.name,
      value: revenue,
      count: serviceReservations.length,
      color: service.color,
    };
  });

  // Patient statistics
  const patientStats = {
    total: patients.length,
    newPatients: patients.filter((p) => {
      const createdDate = new Date(p.createdAt);
      const now = new Date();
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      return createdDate >= monthAgo;
    }).length,
    activePatients: [...new Set(filteredReservations.map((r) => r.patientId))]
      .length,
  };

  // Revenue trends
  const revenueTrends = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthReservations = reservations.filter(
      (r) =>
        r.status === "completed" &&
        r.date.getMonth() === date.getMonth() &&
        r.date.getFullYear() === date.getFullYear()
    );

    const monthRevenue = monthReservations.reduce((sum, r) => {
      const service = services.find((s) => s.id === r.serviceId);
      return sum + (service?.price || 0);
    }, 0);

    revenueTrends.push({
      month: date.toLocaleDateString("es", { month: "short" }),
      revenue: monthRevenue,
      reservations: monthReservations.length,
    });
  }

  const totalRevenue = filteredReservations
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => {
      const service = services.find((s) => s.id === r.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const exportReport = () => {
    // Mock export functionality
    const reportData = {
      period: dateRange,
      totalRevenue,
      totalReservations: filteredReservations.length,
      revenueByService,
      patientStats,
    };

    console.log("Exportando reporte:", reportData);
    alert("Reporte exportado exitosamente");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="font-serif">Período:</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-serif">Tipo de reporte:</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Ingresos</SelectItem>
              <SelectItem value="patients">Pacientes</SelectItem>
              <SelectItem value="services">Servicios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportReport} className="font-sans">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {totalRevenue} Bs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Reservas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {filteredReservations.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Pacientes Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {patientStats.activePatients}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">
              Promedio por Reserva
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {filteredReservations.length > 0
                ? Math.round(totalRevenue / filteredReservations.length)
                : 0}{" "}
              Bs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Ingresos por Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByService.filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value} Bs`}
                >
                  {revenueByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Bs`, "Ingresos"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Tendencia de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} Bs`, "Ingresos"]} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Detalle de Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-sans">Servicio</TableHead>
                <TableHead className="font-sans">Reservas</TableHead>
                <TableHead className="font-sans">Completadas</TableHead>
                <TableHead className="font-sans">Ingresos</TableHead>
                <TableHead className="font-sans">Promedio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueByService.map((service) => {
                const completedCount = filteredReservations.filter(
                  (r) =>
                    r.serviceId ===
                      services.find((s) => s.name === service.name)?.id &&
                    r.status === "completed"
                ).length;

                return (
                  <TableRow key={service.name}>
                    <TableCell className="font-medium font-serif">
                      {service.name}
                    </TableCell>
                    <TableCell className="font-serif">
                      {service.count}
                    </TableCell>
                    <TableCell className="font-serif">
                      {completedCount}
                    </TableCell>
                    <TableCell className="font-serif">
                      {service.value} Bs
                    </TableCell>
                    <TableCell className="font-serif">
                      {service.count > 0
                        ? Math.round(service.value / service.count)
                        : 0}{" "}
                      Bs
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
