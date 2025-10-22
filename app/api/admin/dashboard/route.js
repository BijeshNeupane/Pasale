import authAdmin from "@/app/middlewares/authAdmin";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// get dashboard Data for Admin (total orders, total stores, total products, total revenue)
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    // get total orders
    const orders = await prisma.order.count();

    // get total stores
    const stores = await prisma.store.count();

    // get all orders include only createdAt and total and calculate total revenue
    const allOrders = await prisma.order.findMany({
      select: {
        createdAt: true,
        total: true,
      },
    });

    let totalRevenue = 0;
    allOrders.forEach((order) => {
      totalRevenue += order.total;
    });

    const revenue = totalRevenue.toFixed(2);

    // get total products
    const products = await prisma.product.count();

    const dashboardData = {
      orders,
      stores,
      products,
      revenue,
      allOrders,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}
