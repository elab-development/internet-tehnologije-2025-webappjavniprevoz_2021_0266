import { db } from "@/db";
import { linija, tipprevoza } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  context: { params: any } 
) {
  try {
   
    const params = await context.params;
    const id = params.id; 

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

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
      .leftJoin(tipprevoza, eq(linija.idTipVozila, tipprevoza.idTipaVozila))
      .where(eq(linija.idTipVozila, Number(id)));

    return NextResponse.json(rezultati);
  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}