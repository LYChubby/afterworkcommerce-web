import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function GET() {
  const backendOrigin = new URL(env.apiBaseUrl).origin;
  const googleAuthUrl = new URL("/auth/google", backendOrigin);

  return NextResponse.redirect(googleAuthUrl);
}
