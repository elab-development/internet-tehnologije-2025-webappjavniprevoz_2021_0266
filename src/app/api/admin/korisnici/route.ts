import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const korisnici = await db
      .select({
        id: korisnik.idKorisnik,
        korisnickoIme: korisnik.korisnickoIme,
        email: korisnik.email,
        admin: korisnik.admin,
        createdAt: korisnik.createdAt,
      })
      .from(korisnik)
      .orderBy(desc(korisnik.createdAt));

    return NextResponse.json(korisnici);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}