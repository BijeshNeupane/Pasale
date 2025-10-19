import authSeller from "@/app/middlewares/authSeller";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Auth Seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const storeInfo = await prisma.store.findUnique({
      where: { userId },
    });

    return NextResponse.json({ isSeller, storeInfo }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
