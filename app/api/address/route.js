import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add new address
export async function POST(Request) {
  try {
    const { userId } = getAuth(Request);
    const { address } = await Request.json();

    address.userId = userId;

    const newAddress = await prisma.address.create({ data: address });

    return NextResponse.json({
      newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}

// Get all addresses for a user
export async function GET(Request) {
  try {
    const { userId } = getAuth(Request);

    const addresses = await prisma.address.findMany({ where: { userId } });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
