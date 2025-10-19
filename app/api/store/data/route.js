import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get store info and store products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username").toLowerCase();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // get store info and instock products with ratings

    const store = await prisma.store.findMany({
      where: { username, active: true },
      include: {
        rating: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 400 });
    }

    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
