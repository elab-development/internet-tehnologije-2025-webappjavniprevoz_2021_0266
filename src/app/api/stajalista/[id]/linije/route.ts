import { db } from "@/db";
import { linijanastajalistu, linija, tipprevoza } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rezultati = await db
      .select({
        idLinije: linija.idLinije,
        brojLinije: linija.brojLinije,
        nazivLinije: linija.naziv,
        smer: linijanastajalistu.smer,
        redniBroj: linijanastajalistu.redniBroj,
        tipVozila: tipprevoza.nazivTipaVozila
      })
      .from(linijanastajalistu)
      .innerJoin(linija, eq(linijanastajalistu.idLinije, linija.idLinije))
      .leftJoin(tipprevoza, eq(linija.idTipVozila, tipprevoza.idTipaVozila))
      .where(eq(linijanastajalistu.idStajalista, Number(id)));

    return NextResponse.json(rezultati);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}