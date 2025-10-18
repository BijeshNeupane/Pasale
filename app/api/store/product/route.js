import authSeller from "@/app/middlewares/authSeller";
import imagekit from "@/configs/imageKits";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//  add new product
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const images = formData.getAll("images");

    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      !category ||
      images.length < 1
    ) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });
        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            {
              quality: "auto",
            },
            { format: "webp" },
            { width: "1024" },
          ],
        });
        return url;
      })
    );

    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: imagesUrl,
        storeId,
      },
    });
    return NextResponse.json(
      { message: "product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 }
    );
  }
}

// get all products of a seller

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { storeId },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 }
    );
  }
}
