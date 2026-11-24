import { test } from "node:test";
import assert from "node:assert/strict";
import { ApiResponseError, readApiResponse } from "../src/lib/api-response";

test("HTML gateway errors are reported as server failures", async () => {
  await assert.rejects(
    readApiResponse(new Response("<html>Bad Gateway</html>", { status: 502 })),
    (error: unknown) =>
      error instanceof ApiResponseError &&
      /Server sedang bermasalah/.test(error.message),
  );
});

test("JSON validation errors retain field errors and server message", async () => {
  const result = {
    message: "Judul wajib diisi.",
    errors: { title: "Wajib diisi" },
  };
  assert.deepEqual(
    await readApiResponse(Response.json(result, { status: 422 })),
    result,
  );
});

test("unreadable success responses cannot be mistaken for a successful save", async () => {
  await assert.rejects(
    readApiResponse(new Response("invalid", { status: 200 })),
    ApiResponseError,
  );
});
