import authSeller from "@/app/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// getDashboard for seller (total orders, total earnings, total products)
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    // get all orders for the store
    const orders = await prisma.order.findMany({
      where: {
        storeId,
      },
    });

    // get all products with ratings
    const products = await prisma.product.findMany({
      where: {
        storeId,
      },
    });

    const ratings = await prisma.rating.findMany({
      where: { productId: { in: products.map((product) => product.id) } },
      include: { user: true, product: true },
    });

    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalEarnings: Math.round(
        orders.reduce((acc, order) => acc + order.totalPrice, 0)
      ),
      totalProducts: products.length,
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
