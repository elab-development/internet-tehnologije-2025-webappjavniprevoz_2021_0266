import { db } from "@/db";
import { omiljenastajalista, stajaliste } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { dobijIdIzTokena } from "@/lib/auth";

export async function GET() {
  const ulogovaniId = await dobijIdIzTokena();
  if (!ulogovaniId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const podaci = await db
    .select({
      idFavorita: omiljenastajalista.idOmiljenaStajalista,
      idStajalista: stajaliste.idStajalista,
      naziv: stajaliste.naziv,
      brojStajalista: stajaliste.brojStajalista
    })
    .from(omiljenastajalista)
    .innerJoin(stajaliste, eq(omiljenastajalista.idStajalista, stajaliste.idStajalista))
    .where(eq(omiljenastajalista.idKorisnik, ulogovaniId));

  return NextResponse.json(podaci);
}

export async function POST(request: Request) {
  try {
    const ulogovaniId = await dobijIdIzTokena();
    if (!ulogovaniId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { idStajalista } = await request.json();

    const [result] = await db.insert(omiljenastajalista).values({
      idKorisnik: ulogovaniId,
      idStajalista: Number(idStajalista)
    });

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}