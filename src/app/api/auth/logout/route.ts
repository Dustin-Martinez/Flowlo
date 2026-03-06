import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/src/app/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
