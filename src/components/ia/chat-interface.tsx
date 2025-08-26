"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { db } from "@/src/lib/db";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy tu asistente de IA para la clínica. Puedo ayudarte con información sobre reservas, pacientes, servicios y estadísticas. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
      suggestions: [
        "¿Cuántas reservas tengo hoy?",
        "¿Cuál es mi servicio más popular?",
        "Mostrar ingresos del mes",
        "¿Qué pacientes tienen citas pendientes?",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (
    userMessage: string
  ): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    const patients = db.patients.findAll();
    const services = db.services.findAll();
    const reservations = db.reservations.findAll();

    // Today's reservations
    const today = new Date();
    const todayReservations = reservations.filter(
      (r) => r.date.toDateString() === today.toDateString()
    );

    // This month's data
    const thisMonth = reservations.filter((r) => {
      return (
        r.date.getMonth() === today.getMonth() &&
        r.date.getFullYear() === today.getFullYear()
      );
    });

    // Revenue calculation
    const totalRevenue = reservations
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => {
        const service = services.find((s) => s.id === r.serviceId);
        return sum + (service?.price || 0);
      }, 0);

    // Service popularity
    const serviceStats = services.map((service) => {
      const count = reservations.filter(
        (r) => r.serviceId === service.id
      ).length;
      return { ...service, count };
    });
    serviceStats.sort((a, b) => b.count - a.count);

    // Pending reservations
    const pendingReservations = reservations.filter(
      (r) => r.status === "pending" || r.status === "confirmed"
    );

    if (message.includes("reservas") && message.includes("hoy")) {
      return {
        content: `Hoy tienes ${
          todayReservations.length
        } reservas programadas. ${
          todayReservations.length > 0
            ? `Las próximas citas son: ${todayReservations
                .slice(0, 3)
                .map((r) => {
                  const patient = patients.find((p) => p.id === r.patientId);
                  const service = services.find((s) => s.id === r.serviceId);
                  return `${patient?.name} - ${service?.name} a las ${r.time}`;
                })
                .join(", ")}`
            : "No hay reservas programadas para hoy."
        }`,
        suggestions: [
          "¿Cuántas reservas tengo esta semana?",
          "Mostrar reservas pendientes",
          "¿Cuál es el horario más ocupado?",
        ],
      };
    }

    if (
      message.includes("servicio") &&
      (message.includes("popular") || message.includes("solicitado"))
    ) {
      const topService = serviceStats[0];
      return {
        content: `Tu servicio más popular es "${topService.name}" con ${
          topService.count
        } reservas. Le siguen: ${serviceStats
          .slice(1, 3)
          .map((s) => `${s.name} (${s.count} reservas)`)
          .join(", ")}. Este servicio genera ${
          topService.price
        } Bs por sesión.`,
        suggestions: [
          "¿Cuánto he ganado con este servicio?",
          "Mostrar todos los servicios",
          "¿Qué servicios necesitan más promoción?",
        ],
      };
    }

    if (message.includes("ingresos") || message.includes("ganancia")) {
      const monthlyRevenue = thisMonth
        .filter((r) => r.status === "completed")
        .reduce((sum, r) => {
          const service = services.find((s) => s.id === r.serviceId);
          return sum + (service?.price || 0);
        }, 0);

      return {
        content: `Tus ingresos totales son ${totalRevenue} Bs. Este mes has generado ${monthlyRevenue} Bs con ${
          thisMonth.filter((r) => r.status === "completed").length
        } servicios completados. El promedio por servicio es ${Math.round(
          totalRevenue /
            reservations.filter((r) => r.status === "completed").length
        )} Bs.`,
        suggestions: [
          "¿Cuál es mi mejor mes del año?",
          "Comparar ingresos por servicio",
          "¿Cuánto puedo ganar este mes?",
        ],
      };
    }

    if (message.includes("pacientes") && message.includes("pendientes")) {
      const patientsWithPending = pendingReservations.map((r) => {
        const patient = patients.find((p) => p.id === r.patientId);
        const service = services.find((s) => s.id === r.serviceId);
        return { patient, service, reservation: r };
      });

      return {
        content: `Tienes ${
          pendingReservations.length
        } reservas pendientes: ${patientsWithPending
          .slice(0, 5)
          .map(
            ({ patient, service, reservation }) =>
              `${patient?.name} - ${
                service?.name
              } (${reservation.date.toLocaleDateString()})`
          )
          .join(", ")}${
          pendingReservations.length > 5
            ? ` y ${pendingReservations.length - 5} más`
            : ""
        }.`,
        suggestions: [
          "¿Cómo contactar a estos pacientes?",
          "Mostrar reservas de la próxima semana",
          "¿Qué pacientes cancelaron recientemente?",
        ],
      };
    }

    if (message.includes("estadísticas") || message.includes("resumen")) {
      return {
        content: `Aquí tienes un resumen de tu clínica: 📊 ${
          patients.length
        } pacientes registrados, ${services.length} servicios activos, ${
          reservations.length
        } reservas totales, ${totalRevenue} Bs en ingresos. Tu tasa de ocupación promedio es del ${Math.round(
          (reservations.filter((r) => r.status !== "cancelled").length /
            reservations.length) *
            100
        )}%.`,
        suggestions: [
          "¿Cuál es mi horario más ocupado?",
          "Mostrar tendencias mensuales",
          "¿Cómo mejorar mis ingresos?",
        ],
      };
    }

    if (message.includes("semana")) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekReservations = reservations.filter(
        (r) => r.date >= weekStart && r.date <= weekEnd
      );

      return {
        content: `Esta semana tienes ${
          weekReservations.length
        } reservas programadas. ${
          weekReservations.length > 0
            ? `Los días más ocupados son: ${weekReservations
                .reduce((acc: any[], r) => {
                  const day = r.date.toLocaleDateString("es", {
                    weekday: "long",
                  });
                  const existing = acc.find((item) => item.day === day);
                  if (existing) {
                    existing.count++;
                  } else {
                    acc.push({ day, count: 1 });
                  }
                  return acc;
                }, [])
                .sort((a, b) => b.count - a.count)
                .slice(0, 2)
                .map((item) => `${item.day} (${item.count} citas)`)
                .join(", ")}`
            : "Esta semana está bastante libre."
        }`,
        suggestions: [
          "¿Puedo agendar más citas?",
          "Mostrar horarios disponibles",
          "¿Qué servicios ofrecer más?",
        ],
      };
    }

    // Default responses for unrecognized queries
    const defaultResponses = [
      {
        content:
          "Puedo ayudarte con información sobre reservas, pacientes, servicios y estadísticas de tu clínica. ¿Qué te gustaría saber específicamente?",
        suggestions: [
          "¿Cuántas reservas tengo hoy?",
          "¿Cuál es mi servicio más popular?",
          "Mostrar ingresos del mes",
          "¿Qué pacientes tienen citas pendientes?",
        ],
      },
      {
        content:
          "Estoy aquí para ayudarte a gestionar mejor tu clínica. Puedo darte información sobre tus pacientes, reservas, ingresos y mucho más.",
        suggestions: [
          "Mostrar estadísticas generales",
          "¿Cuál es mi mejor día de la semana?",
          "¿Cómo van mis ingresos este mes?",
        ],
      },
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: "ai",
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 font-sans">
          <Bot className="h-5 w-5 text-primary" />
          Asistente IA - Clínica Pro
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "ai" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] ${
                  message.sender === "user" ? "order-first" : ""
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm font-serif whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground mt-1 font-serif">
                  {message.timestamp.toLocaleTimeString("es", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs font-serif"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {message.sender === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregunta sobre reservas, pacientes, servicios..."
              className="flex-1 font-serif"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="font-sans"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 font-serif"
              onClick={() =>
                handleSuggestionClick("¿Cuántas reservas tengo hoy?")
              }
            >
              <Calendar className="h-3 w-3 mr-1" />
              Reservas hoy
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 font-serif"
              onClick={() => handleSuggestionClick("Mostrar ingresos del mes")}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Ingresos
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 font-serif"
              onClick={() =>
                handleSuggestionClick("¿Cuál es mi servicio más popular?")
              }
            >
              <Briefcase className="h-3 w-3 mr-1" />
              Servicios
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 font-serif"
              onClick={() =>
                handleSuggestionClick("Mostrar estadísticas generales")
              }
            >
              <Users className="h-3 w-3 mr-1" />
              Estadísticas
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
