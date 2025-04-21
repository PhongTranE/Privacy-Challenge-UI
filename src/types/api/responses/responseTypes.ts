export type status = "success" | "error";

export type FieldErrorMap = Record<string, string[]>;

export interface APIResponse<T> {
    status: status;
    message: string | { json: FieldErrorMap };
    data?: T;
    error?: string;
}
