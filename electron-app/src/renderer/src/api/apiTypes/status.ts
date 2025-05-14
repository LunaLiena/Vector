import React from "react";

export interface ApiStatus {
    id: number;
    status_name: string;
}

export interface Status extends ApiStatus {
    color?: string;
    icon?: React.ReactNode;
}

export const STATUS_VALUES = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    REJECTED: 'rejected'
} as const;

