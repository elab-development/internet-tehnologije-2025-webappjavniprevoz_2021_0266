import { db } from "@/db";
import { linijanastajalistu, linija, stajaliste } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rezultati = await db
      .select({
        id: linijanastajalistu.idLinijaStajaliste,
        brojLinije: linija.brojLinije,
        stajaliste: stajaliste.naziv,
        redniBroj: linijanastajalistu.redniBroj,
        smer: linijanastajalistu.smer
      })
      .from(linijanastajalistu)
      .leftJoin(linija, eq(linijanastajalistu.idLinije, linija.idLinije))
      .leftJoin(stajaliste, eq(linijanastajalistu.idStajalista, stajaliste.idStajalista))
      .orderBy(asc(linija.brojLinije), asc(linijanastajalistu.redniBroj));

    return NextResponse.json(rezultati);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idLinije, idStajalista, smer, redniBroj } = body;

    const [result] = await db.insert(linijanastajalistu).values({
      idLinije: Number(idLinije),
      idStajalista: Number(idStajalista),
      smer: Number(smer),
      redniBroj: Number(redniBroj)
    });

    return NextResponse.json({ message: "Stanica uspešno dodata na liniju", id: result.insertId });
  } catch (error: any) {
    return NextResponse.json({ error: "Greška: Proverite ID-eve linije i stanice" }, { status: 400 });
  }
}