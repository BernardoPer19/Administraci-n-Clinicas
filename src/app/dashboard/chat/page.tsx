import { ChatInterface } from "@/src/components/ia/chat-interface";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-sans">
          Chat con IA
        </h1>
        <p className="text-muted-foreground font-serif">
          Asistente inteligente para consultas sobre reservas y calendario
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}
