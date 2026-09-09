import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const rounds = await prisma.round.findMany({
      include: {
        edition: true,
        participants: true,
      },
      orderBy: [
        { editionId: "desc" },
        { roundNumber: "asc" },
      ],
    });

    return Response.json({
      success: true,
      rounds,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.editionId || !body.name || !body.roundNumber) {
      return Response.json(
        {
          success: false,
          error: "Edition, name and round number are required",
        },
        { status: 400 }
      );
    }

    const round = await prisma.round.create({
      data: {
        editionId: body.editionId,
        name: body.name.trim(),
        slug:
          body.slug?.trim() ||
          body.name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
        description: body.description || null,
        roundNumber: Number(body.roundNumber),
        status: body.status || "UPCOMING",
      },
    });

    return Response.json({
      success: true,
      round,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    const round = await prisma.round.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        status: body.status,
      },
    });

    return Response.json({
      success: true,
      round,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
