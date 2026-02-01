import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await db.select().from(korisnik);
  return NextResponse.json(result);
}
