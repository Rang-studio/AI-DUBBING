import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWhitelist } from "@/lib/whitelist";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getWhitelist();
  return NextResponse.json({ users: rows });
}
