import imagekit from "@/configs/imageKits";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// create store
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const formdata = await request.formData();

    const name = formdata.get("name");
    const username = formdata.get("username");
    const description = formdata.get("description");
    const email = formdata.get("email");
    const contact = formdata.get("contact");
    const address = formdata.get("address");
    const image = formdata.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "Missing store information" },
        { status: 400 }
      );
    }

    // check if user has a store already
    const store = await prisma.store.findFirst({
      where: {
        userId,
      },
    });

    // if store exists, return status of store
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    // check if username is taken
    const usernameTaken = await prisma.store.findFirst({
      where: {
        username: username.toLowerCase(),
      },
    });

    // if username is taken, return error
    if (usernameTaken) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }
    // image upload to imagekit
    const buffer = Buffer.from(await image.arrayBuffer());

    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    const newStore = await prisma.store.create({
      data: {
        userId,
        name: name.toString(),
        username: username.toString().toLowerCase(),
        description: description.toString(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    });

    // link store to user
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        store: { connect: { id: newStore.id } },
      },
    });

    return NextResponse.json({
      message:
        "Your store creation request has been submitted, we will approve it shortly.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 }
    );
  }
}

// check if user has a store and return store status
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const store = await prisma.store.findFirst({
      where: {
        userId,
      },
    });

    if (store) {
      return NextResponse.json({
        status: store.status,
      });
    }
    return NextResponse.json({
      status: "not registered",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 }
    );
  }
}
