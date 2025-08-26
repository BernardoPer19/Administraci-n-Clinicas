import { LoginForm } from "@/src/components/form/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground font-sans">
            Sistema de Reservas
          </h1>
          <p className="text-muted-foreground mt-2 font-serif">
            Accede a tu cuenta para gestionar la clínica
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
