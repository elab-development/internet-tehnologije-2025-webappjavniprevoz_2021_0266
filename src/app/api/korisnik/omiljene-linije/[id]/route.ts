import { db } from "@/db";
import { omiljenelinije, linija } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { dobijIdIzTokena } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ulogovaniId = await dobijIdIzTokena();

    if (!ulogovaniId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.delete(omiljenelinije)
      .where(
        and(
          eq(omiljenelinije.idOmiljeneLinije, Number(id)),
          eq(omiljenelinije.idKorisnik, ulogovaniId)
        )
      );

   
    if (result[0].affectedRows === 0) {
      return NextResponse.json(
        { error: "Zapis nije pronađen ili nemate dozvolu da ga obrišete" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Uspešno obrisano" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}