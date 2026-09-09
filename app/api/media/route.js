import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ success: true, media });
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

    if (!body.title || !body.url) {
      return Response.json(
        {
          success: false,
          error: "Title and URL are required",
        },
        { status: 400 }
      );
    }

    const media = await prisma.media.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        url: body.url.trim(),
        thumbnail: body.thumbnail || null,
        type: body.type || "IMAGE",
        altText: body.altText || null,
      },
    });

    return Response.json({
      success: true,
      media,
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
    const { id } = await request.json();

    await prisma.media.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}