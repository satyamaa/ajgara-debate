import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        edition: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ success: true, posts });
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
      body.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    const post = await prisma.post.create({
      data: {
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt || null,
        content: body.content.trim(),
        coverImage: body.coverImage || null,
        status: body.status || "DRAFT",
        publishedAt:
          body.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return Response.json({ success: true, post });
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

    const post = await prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        status: body.status,
        publishedAt:
          body.status === "PUBLISHED"
            ? new Date()
            : null,
      },
    });

    return Response.json({ success: true, post });
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

    await prisma.post.delete({
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