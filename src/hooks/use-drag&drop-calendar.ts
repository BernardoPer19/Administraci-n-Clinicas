"use client";

import { useState } from "react";
import { getReservations, updateReservation } from "../server/reservations/reservations-actions";
import { Reservation } from "@prisma/client";


export function useDragDropCalendar() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [draggedReservation, setDraggedReservation] =
        useState<Reservation | null>(null);

    const handleDragStart = (e: React.DragEvent, reservation: Reservation) => {
        setDraggedReservation(reservation);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, newDate: Date) => {
        e.preventDefault();

        if (draggedReservation) {
            await updateReservation(draggedReservation.id, {
                date: new Date(newDate),
            });
            setDraggedReservation(null);
        }
    };

    return {
        reservations,
        draggedReservation,
        setDraggedReservation,
        handleDragStart,
        handleDragOver,
        handleDrop,
    };
}
