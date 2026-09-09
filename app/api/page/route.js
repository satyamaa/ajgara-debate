import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return Response.json({ success: true, pages });
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

    if (!body.title || !body.content) {
      return Response.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug?.trim() ||
      body.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

    const page = await prisma.page.create({
      data: {
        title: body.title.trim(),
        slug,
        content: body.content,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        isPublished: Boolean(body.isPublished),
      },
    });

    return Response.json({ success: true, page });
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

    const page = await prisma.page.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        isPublished: body.isPublished,
      },
    });

    return Response.json({ success: true, page });
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

    await prisma.page.delete({
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