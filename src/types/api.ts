export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta: Record<string, unknown> | null;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  errors: Record<string, string[]> | null;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
