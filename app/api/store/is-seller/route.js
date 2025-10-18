export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
  } catch (error) {}
}
