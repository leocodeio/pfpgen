import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, operations } = body;

    if (!imageUrl || !operations) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || (user.plan === "FREE" && user.credits <= 0)) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 },
      );
    }

    // Create processing record
    const processedImage = await prisma.processedImage.create({
      data: {
        userId: session.user.id,
        originalUrl: imageUrl,
        operations: JSON.parse(JSON.stringify(operations)),
        status: "PROCESSING",
      },
    });

    // For now, return a placeholder response
    // TODO: Implement actual image processing
    const placeholderUrl = imageUrl + "?processed=true";

    // Update processing record
    await prisma.processedImage.update({
      where: { id: processedImage.id },
      data: {
        processedUrl: placeholderUrl,
        status: "COMPLETED",
      },
    });

    // Deduct credits for free users
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          credits: user.credits - 1,
        },
      });
    }

    return NextResponse.json({
      id: processedImage.id,
      processedUrl: placeholderUrl,
      operations: operations,
    });
  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}
