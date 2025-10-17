import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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
  } catch (error) {}
}
