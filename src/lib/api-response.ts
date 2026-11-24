export class ApiResponseError extends Error {}

export async function readApiResponse(response: Response): Promise<{
  message?: string;
  errors?: Record<string, string>;
}> {
  try {
    const result = await response.json();
    if (!result || typeof result !== "object" || Array.isArray(result))
      throw new Error("Invalid response");
    return result;
  } catch {
    throw new ApiResponseError(
      response.status >= 500
        ? "Server sedang bermasalah. Isian tetap tersedia. Coba kembali beberapa saat lagi."
        : "Respons server tidak dapat dibaca. Isian tetap tersedia. Coba kembali.",
    );
  }
}
