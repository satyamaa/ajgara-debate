import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "../../../../lib/prisma";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET
);

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return Response.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!valid) {
      return Response.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    const response = Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.headers.append(
      "Set-Cookie",
      `ajgara_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${
        process.env.NODE_ENV === "production"
          ? "; Secure"
          : ""
      }`
    );

    return response;
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}