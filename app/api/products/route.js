import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get all products
export async function GET(request) {
  try {
    let product = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        rating: {
          select: {
            createdAt: true,
            rating: true,
            review: true,
            user: { select: { name: true, image: true } },
          },
        },
        store: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // remove products with store isActive is false
    product = product.filter((product) => product.store.isActive);

    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
