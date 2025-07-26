import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const images = await prisma.processedImage.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({
      images: images.map((image: any) => ({
        id: image.id,
        originalUrl: image.originalUrl,
        processedUrl: image.processedUrl,
        status: image.status,
        createdAt: image.createdAt.toISOString(),
        operations: image.operations,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch user images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
