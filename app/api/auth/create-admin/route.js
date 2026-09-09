import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.password) {
      return Response.json(
        { success: false, error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return Response.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existing) {
      return Response.json(
        { success: false, error: "Admin already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.toLowerCase().trim(),
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}