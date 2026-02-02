import { db } from "@/db";
import { tipprevoza } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params; 
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID mora biti broj" }, { status: 400 });
    }

    const { nazivTipaVozila } = await request.json();

    await db.update(tipprevoza)
      .set({ nazivTipaVozila: nazivTipaVozila })
      .where(eq(tipprevoza.idTipaVozila, id));

    return NextResponse.json({ message: "Uspešno izmenjeno" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params; 
    const id = Number(resolvedParams.id);
    await db.delete(tipprevoza)
      .where(eq(tipprevoza.idTipaVozila, id));

    return NextResponse.json({ message: "Uspešno obrisano" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}