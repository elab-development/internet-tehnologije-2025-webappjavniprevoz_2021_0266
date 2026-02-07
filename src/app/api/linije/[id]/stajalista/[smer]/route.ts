import { db } from "@/db";
import { linijanastajalistu, linija, stajaliste } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string, smer:string }> }
) {
  try {
    const { id,smer } = await params;

    const staniceLinije = await db
      .select({
        redniBroj: linijanastajalistu.redniBroj,
        nazivStanice: stajaliste.naziv,
        lat: stajaliste.latitude,
        lng: stajaliste.longitude
      })
      .from(linijanastajalistu)
      .innerJoin(stajaliste, eq(linijanastajalistu.idStajalista, stajaliste.idStajalista))
      .where(and(
            eq(linijanastajalistu.idLinije, Number(id)),
            eq(linijanastajalistu.smer, Number(smer))))
      .orderBy(asc(linijanastajalistu.redniBroj));

    return NextResponse.json(staniceLinije);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

