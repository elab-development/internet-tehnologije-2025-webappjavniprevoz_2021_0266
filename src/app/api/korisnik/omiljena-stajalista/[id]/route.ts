import { db } from "@/db";
import { omiljenastajalista } from "@/db/schema";
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
    if (!ulogovaniId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await db.delete(omiljenastajalista)
      .where(
        and(
          eq(omiljenastajalista.idStajalista, Number(id)),
          eq(omiljenastajalista.idKorisnik, ulogovaniId)
        )
      );

    if (result[0].affectedRows === 0) {
      return NextResponse.json({ error: "Zapis nije pronađen" }, { status: 404 });
    }

    return NextResponse.json({ message: "Stajalište uklonjeno iz omiljenih" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}