import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Test - Email:", email);
    console.log("Test - Password:", password);
    console.log("Test - Password chars:", [...password].map(c => c.charCodeAt(0)));

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    return NextResponse.json({
      email,
      passwordReceived: password,
      passwordLength: password.length,
      isValid,
      hashPrefix: user.password.substring(0, 20),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
