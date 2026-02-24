import { db } from "@/db";
import { korisnik, linija, stajaliste, omiljenelinije, tipprevoza, linijanastajalistu } from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const [korisniciCount] = await db.select({ count: sql<number>`count(*)` }).from(korisnik);
    const [omiljeneCount] = await db.select({ count: sql<number>`count(*)` }).from(omiljenelinije);
    const [stajalistaCount] = await db.select({ count: sql<number>`count(*)` }).from(stajaliste);

    
    const linijePoTipu = await db
      .select({
        naziv: tipprevoza.nazivTipaVozila,
        vrednost: sql<number>`count(${linija.idLinije})`
      })
      .from(tipprevoza)
      .leftJoin(linija, eq(tipprevoza.idTipaVozila, linija.idTipVozila))
      .groupBy(tipprevoza.nazivTipaVozila);

    
    const topStajalista = await db
      .select({
        naziv: stajaliste.naziv,
        brojPojavljivanja: sql<number>`count(${linijanastajalistu.idLinije})`
      })
      .from(stajaliste)
      .leftJoin(linijanastajalistu, eq(stajaliste.idStajalista, linijanastajalistu.idStajalista))
      .groupBy(stajaliste.idStajalista, stajaliste.naziv)
      .orderBy(desc(sql`count(${linijanastajalistu.idLinije})`))
      .limit(5);

    return NextResponse.json({
      korisnici: korisniciCount.count,
      stajalista: stajalistaCount.count,
      omiljene: omiljeneCount.count,
      linijeStatistika: linijePoTipu,
      popularnaStajalista: topStajalista,
      ukupnoLinija: linijePoTipu.reduce((acc, curr) => acc + curr.vrednost, 0)
    });
  } catch (error: any) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}