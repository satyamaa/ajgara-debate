import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      count: questions.length,
      questions,
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

    if (!body.question?.trim()) {
      return Response.json(
        { success: false, error: "Question is required" },
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

    const question = await prisma.question.create({
      data: {
        editionId: edition.id,
        question: body.question.trim(),
        theme: body.theme || null,
        source: body.source || null,
        status: "PENDING",
      },
    });

    return Response.json({
      success: true,
      question,
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

    const question = await prisma.question.update({
      where: { id: body.id },
      data: {
        status: body.status,
        isFeatured: body.isFeatured ?? false,
        approvedAt:
          body.status === "APPROVED" || body.status === "FEATURED"
            ? new Date()
            : null,
      },
    });

    return Response.json({
      success: true,
      question,
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

    await prisma.question.delete({
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