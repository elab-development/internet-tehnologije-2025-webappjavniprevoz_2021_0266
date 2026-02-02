import { db } from "@/db";
import { omiljenelinije, linija } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { dobijIdIzTokena } from "@/lib/auth";
export async function GET() {
  try {
    const ulogovaniId = await dobijIdIzTokena();

    if (!ulogovaniId) {
      return NextResponse.json({ error: "Niste autorizovani" }, { status: 401 });
    }

    const rezultati = await db
      .select({
        idFavorita: omiljenelinije.idOmiljeneLinije,
        brojLinije: linija.brojLinije,
        nazivLinije: linija.naziv
      })
      .from(omiljenelinije)
      .innerJoin(linija, eq(omiljenelinije.idLinije, linija.idLinije))
      .where(eq(omiljenelinije.idKorisnik, ulogovaniId));

    return NextResponse.json(rezultati);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idLinije } = body; 

    const ulogovaniId = await dobijIdIzTokena();

    if (!ulogovaniId) {
      return NextResponse.json({ error: "Niste autorizovani" }, { status: 401 });
    }

    const [result] = await db.insert(omiljenelinije).values({
      idKorisnik: ulogovaniId, 
      idLinije: Number(idLinije)
    });

    return NextResponse.json({ 
      message: "Linija dodata u omiljene", 
      id: result.insertId 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}