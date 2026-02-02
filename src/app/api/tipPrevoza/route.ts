import { db } from "@/db";
import { tipprevoza } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const podaci = await db.select().from(tipprevoza);
    return NextResponse.json(podaci);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri čitanju tipova prevoza" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nazivTipaVozila } = body;

    if (!nazivTipaVozila) {
      return NextResponse.json({ error: "Naziv tipa vozila je obavezan" }, { status: 400 });
    }

    const [result] = await db.insert(tipprevoza).values({ 
      nazivTipaVozila: nazivTipaVozila 
    });

    return NextResponse.json({ 
      message: "Uspešno kreirano", 
      id: result.insertId 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}