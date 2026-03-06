import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/app/lib/db";
import { createSession, setSessionCookie } from "@/src/app/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
      },
    });

    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    console.error("Register error:", e);
    const message = e instanceof Error ? e.message : "Registration failed";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Registration failed" },
      { status: 500 }
    );
  }
}
