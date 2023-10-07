import "server-only";

export type ApiResponse<T = unknown, S extends boolean = boolean> = S extends true ? {
  success: true,
  data: T,
} : {
  success: false,
  error: {
    message: string,
  },
};

function success<T = unknown>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function fail(error: Error): ApiResponse {
  return { success: false, error: { message: error.message } };
}

export function successResponse<T>(data: T) {
  return Response.json(success(data));
}

export function failResponse(error: Error) {
  return Response.json(fail(error));
}
