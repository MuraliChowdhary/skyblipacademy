// src/backend/lib/api-response.ts
import { NextResponse } from "next/server";

export type ApiError = { code: string; message: string };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(code: string, message: string, status: number) {
  return NextResponse.json(
    { success: false, error: { code, message } as ApiError },
    { status }
  );
}