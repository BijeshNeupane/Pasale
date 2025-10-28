import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// update user cart
export async function POST(Request) {
  try {
    const { userId } = getAuth(Request);
    const { cart } = await Request.json();
    // save cart to database
    await prisma.user.update({
      where: { id: userId },
      data: { cart },
    });

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}

// get user cart
export async function GET(Request) {
  try {
    const { userId } = getAuth(Request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ cart: user.cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
