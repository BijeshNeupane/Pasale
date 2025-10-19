import authSeller from "@/app/middlewares/authSeller";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//toggle stock of product
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const productId = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "missing details: productId" },
        { status: 400 }
      );
    }

    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    // check if product exists and belongs to the seller
    const product = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });

    if (!product) {
      return NextResponse.json({ error: "product not found" }, { status: 404 });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });

    return NextResponse.json(
      { message: "stock status updated" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 }
    );
  }
}
