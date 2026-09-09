import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const editions = await prisma.edition.findMany({
      include: {
        rounds: true,
        _count: {
          select: {
            participants: true,
            questions: true,
          },
        },
      },
      orderBy: {
        year: "desc",
      },
    });

    return Response.json({ success: true, editions });
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

    if (!body.year || !body.title) {
      return Response.json(
        { success: false, error: "Year and title are required" },
        { status: 400 }
      );
    }

    const year = Number(body.year);

    const edition = await prisma.edition.create({
      data: {
        year,
        title: body.title.trim(),
        slug:
          body.slug?.trim() ||
          `ajgara-debate-${year}`,
        description: body.description || null,
        status: body.status || "DRAFT",
      },
    });

    return Response.json({
      success: true,
      edition,
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

    const edition = await prisma.edition.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
      },
    });

    return Response.json({
      success: true,
      edition,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}