import { db } from "@/db";
import { linijanastajalistu } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idZaIzmenu = Number(id);

    if (isNaN(idZaIzmenu)) {
      return NextResponse.json({ error: "ID mora biti broj" }, { status: 400 });
    }

    const { idLinije, idStajalista, smer, redniBroj } = body;

    await db.update(linijanastajalistu)
      .set({
      
        idLinije: idLinije ? Number(idLinije) : undefined,
        idStajalista: idStajalista ? Number(idStajalista) : undefined,
        smer: smer !== undefined ? Number(smer) : undefined,
        redniBroj: redniBroj ? Number(redniBroj) : undefined,
      })
      .where(eq(linijanastajalistu.idLinijaStajaliste, idZaIzmenu));

    return NextResponse.json({ message: "Veza uspešno ažurirana" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idZaBrisanje = Number(id);

    await db.delete(linijanastajalistu)
      .where(eq(linijanastajalistu.idLinijaStajaliste, idZaBrisanje));

    return NextResponse.json({ message: "Veza obrisana" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}