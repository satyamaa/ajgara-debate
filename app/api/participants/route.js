import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        edition: true,
        round: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      count: participants.length,
      participants,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return Response.json(
        { success: false, error: "Participant name is required" },
        { status: 400 }
      );
    }

    let edition = await prisma.edition.findUnique({
      where: { year: 2026 },
    });

    if (!edition) {
      edition = await prisma.edition.create({
        data: {
          year: 2026,
          title: "Ajgara Debate 2026",
          slug: "ajgara-debate-2026",
          status: "ACTIVE",
        },
      });
    }

    const slug =
      body.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    const participant = await prisma.participant.create({
      data: {
        editionId: edition.id,
        name: body.name.trim(),
        slug,
        village: body.village || null,
        block: body.block || null,
        district: body.district || null,
        photoUrl: body.photoUrl || null,
        bio: body.bio || null,
        score: body.score ? Number(body.score) : null,
        status: "REGISTERED",
      },
    });

    return Response.json({
      success: true,
      participant,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    const participant = await prisma.participant.update({
      where: { id: body.id },
      data: {
        status: body.status,
        score:
          body.score !== undefined && body.score !== ""
            ? Number(body.score)
            : undefined,
      },
    });

    return Response.json({
      success: true,
      participant,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    await prisma.participant.delete({
      where: { id: body.id },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}