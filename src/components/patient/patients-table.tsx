"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { EditPatientDialog } from "@/src/components/patient/edit-patient-dialog";
import { DeletePatientDialog } from "@/src/components/patient/delete-patient-dialog";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import type { Patient } from "@prisma/client";

interface PatientsTableProps {
  patients: Patient[];
}

export function PatientsTable({
  patients: initialPatients,
}: PatientsTableProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-serif"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Nombre</TableHead>
              <TableHead className="font-sans">Teléfono</TableHead>
              <TableHead className="font-sans">Email</TableHead>
              <TableHead className="font-sans">Edad</TableHead>
              <TableHead className="font-sans">Reservas</TableHead>
              <TableHead className="font-sans">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium font-serif">
                  {patient.name}
                </TableCell>
                <TableCell className="font-serif">{patient.phone}</TableCell>
                <TableCell className="font-serif">{patient.email}</TableCell>
                <TableCell className="font-serif">{patient.age} años</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-sans">
                    {/* {patient._count?.reservations || 0} */}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/patients/${patient.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <EditPatientDialog
                      patient={patient}
                    >
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditPatientDialog>
                    <DeletePatientDialog
                      patient={patient}
                    >
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeletePatientDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
