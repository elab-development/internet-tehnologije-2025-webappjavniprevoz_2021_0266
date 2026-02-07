import { db } from "@/db";
import { linija, tipprevoza } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    
    const rezultati = await db
      .select({
        idLinije: linija.idLinije,
        naziv: linija.naziv,
        pocetna: linija.pocetnaStanica,
        krajnja: linija.krajnjaStanica,
        brojLinije: linija.brojLinije,
        tipVozila: tipprevoza.nazivTipaVozila
      })
      .from(linija)
      .leftJoin(tipprevoza, eq(linija.idTipVozila, tipprevoza.idTipaVozila));

    return NextResponse.json(rezultati);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { naziv,brojLinije, pocetnaStanica, krajnjaStanica, idTipVozila } = body;

    const [result] = await db.insert(linija).values({
      naziv,
      brojLinije,
      pocetnaStanica,
      krajnjaStanica,
      idTipVozila,
    });

    return NextResponse.json({ message: "Linija kreirana", id: result.insertId }, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Greška: Tip vozila ne postoji ili su podaci neispravni" }, { status: 400 });
  }
}