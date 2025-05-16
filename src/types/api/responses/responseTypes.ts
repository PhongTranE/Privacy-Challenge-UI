export type status = "success" | "error";

export type FieldErrorMap = Record<string, string[]>;

export interface APIResponse<T> {
  status: status;
  message: string | { json: FieldErrorMap };
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}