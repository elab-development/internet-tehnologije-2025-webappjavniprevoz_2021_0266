import { db } from "@/db";
import { stajaliste } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sveStanice = await db.select().from(stajaliste);
    return NextResponse.json(sveStanice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. Proveri da li su nazivi u body-ju isti kao u Postmanu
    const { naziv, latitude, longitude, brojStajalista } = body;

    const [result] = await db.insert(stajaliste).values({
      naziv: naziv, // Skini String() - samo naziv
      latitude: latitude, // Skini String() - baza očekuje broj/double
      longitude: longitude,
      brojStajalista: Number(brojStajalista)
    });

    return NextResponse.json({ message: "Uspešno", id: result.insertId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}