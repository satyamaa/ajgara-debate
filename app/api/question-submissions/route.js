import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const submissions = await prisma.questionSubmission.findMany({
      include: {
        edition: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("GET SUBMISSIONS ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.question?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Question is required",
        },
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

    const submission = await prisma.questionSubmission.create({
      data: {
        editionId: edition.id,
        name: body.name?.trim() || null,
        email: body.email?.trim() || null,
        question: body.question.trim(),
        theme: body.theme?.trim() || null,
        status: "PENDING",
      },
    });

    return Response.json({
      success: true,
      message: "Question submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("POST SUBMISSION ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json(
        { success: false, error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const submission = await prisma.questionSubmission.findUnique({
      where: { id: body.id },
    });

    if (!submission) {
      return Response.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    const updatedSubmission = await prisma.questionSubmission.update({
      where: { id: body.id },
      data: {
        status: body.status,
        isFeatured: body.isFeatured ?? false,
        reviewedAt:
          body.status === "APPROVED" || body.status === "FEATURED"
            ? new Date()
            : null,
      },
    });

    if (body.status === "FEATURED" && body.isFeatured === true) {
      const existingQuestion = await prisma.question.findFirst({
        where: {
          editionId: submission.editionId,
          question: submission.question,
        },
      });

      if (existingQuestion) {
        await prisma.question.update({
          where: { id: existingQuestion.id },
          data: {
            status: "FEATURED",
            isFeatured: true,
            approvedAt: new Date(),
          },
        });
      } else {
        await prisma.question.create({
          data: {
            editionId: submission.editionId,
            question: submission.question,
            theme: submission.theme,
            status: "FEATURED",
            isFeatured: true,
            submittedBy: submission.name || "Public Submission",
            approvedAt: new Date(),
          },
        });
      }
    }

    return Response.json({
      success: true,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("PATCH SUBMISSION ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json(
        {
          success: false,
          error: "Submission ID is required",
        },
        { status: 400 }
      );
    }

    await prisma.questionSubmission.delete({
      where: {
        id: body.id,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE SUBMISSION ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}