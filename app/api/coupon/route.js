import prisma from "@/lib/prisma";
import { useAuth } from "@clerk/nextjs/server";

// verify coupon
export async function GET(Request) {
  try {
    const { userId, has } = useAuth(Request);
    const { code } = await Request.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), expiresAt: { gt: new Date() } },
    });

    if (!coupon)
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );

    if (coupon.forNewUser) {
      const userOrders = await prisma.order.findMany({
        where: { userId },
      });

      if (userOrders.length > 0) {
        return NextResponse.json(
          {
            error: "Coupon valid for new users only",
          },
          { status: 400 }
        );
      }
    }

    if (coupon.forMember) {
      const hasPlusPlan = has({ plan: "plus" });

      if (!hasPlusPlan) {
        return NextResponse.json(
          {
            error: "Coupon valid for members only",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
