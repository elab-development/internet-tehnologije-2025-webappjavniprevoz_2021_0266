import { db } from "@/db";
import { tipprevoza } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID mora biti broj" }, { status: 400 });
    }

    const { nazivTipaVozila } = await request.json();

    if (!nazivTipaVozila) {
      return NextResponse.json({ error: "Naziv tipa vozila je obavezan" }, { status: 400 });
    }

    await db.update(tipprevoza)
      .set({ nazivTipaVozila })
      .where(eq(tipprevoza.idTipaVozila, numericId));

    return NextResponse.json({ message: "Uspešno izmenjeno" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Dodato Promise
) {
  try {
    const { id } = await params; 
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID mora biti broj" }, { status: 400 });
    }

    await db.delete(tipprevoza)
      .where(eq(tipprevoza.idTipaVozila, numericId));

    return NextResponse.json({ message: "Uspešno obrisano" });
  } catch (error: any) {
    // Ako MySQL baci grešku zbog stranog ključa (npr. postoje linije sa ovim tipom)
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ error: "Ne možete obrisati tip prevoza koji se koristi u linijama." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}