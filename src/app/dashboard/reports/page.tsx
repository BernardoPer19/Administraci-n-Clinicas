import { ReportsView } from "@/src/components/reports/reports-view";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-sans">
          Reportes
        </h1>
        <p className="text-muted-foreground font-serif">
          Análisis detallado y reportes de la clínica
        </p>
      </div>

      <ReportsView />
    </div>
  );
}
