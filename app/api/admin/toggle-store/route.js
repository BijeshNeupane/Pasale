import authAdmin from "@/app/middlewares/authAdmin";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// toggle store isActive
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    const { storeId } = await request.json();

    if (!storeId) {
      return NextResponse.json({ message: "missing storeId" }, { status: 400 });
    }

    // find the store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ message: "store not found" }, { status: 404 });
    }

    // toggle isActive
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { isActive: !store.isActive },
    });

    return NextResponse.json({ message: "store updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message || error.code },
      { status: 500 }
    );
  }
}
