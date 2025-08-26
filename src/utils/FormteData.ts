export const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // 2025-08-27
};
