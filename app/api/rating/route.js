import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// add new rating
export async function POST(Request) {
  try {
    const { userId } = getAuth(Request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { orderId, productId, rating, review } = await Request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: userId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAlreadyRated = await prisma.rating.findFirst({
      where: { orderId: orderId, productId: productId },
    });

    if (isAlreadyRated) {
      return NextResponse.json(
        { error: "Product already rated" },
        { status: 400 }
      );
    }

    const response = await prisma.rating.create({
      data: { userId, productId, rating, review, orderId },
    });

    return NextResponse.json({
      message: "Rating added successfully",
      rating: response,
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    return NextResponse.json(
      { error: "Failed to add rating" },
      { status: 500 }
    );
  }
}

// get ratings for a product
export async function GET(Request) {
  try {
    const { userId } = getAuth(Request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error getting ratings:", error);
    return NextResponse.json(
      { error: "Failed to get ratings" },
      { status: 500 }
    );
  }
}
