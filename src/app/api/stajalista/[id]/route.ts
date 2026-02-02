import { db } from "@/db";
import { stajaliste } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
 
    const { naziv, latitude, longitude, brojStajalista } = body;

    await db.update(stajaliste)
      .set({
        naziv,
        latitude,
        longitude,
        brojStajalista: brojStajalista ? Number(brojStajalista) : undefined
      })
      .where(eq(stajaliste.idStajalista, Number(id)));

    return NextResponse.json({ message: "Stajalište uspešno izmenjeno" });
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

    await db.delete(stajaliste)
      .where(eq(stajaliste.idStajalista, Number(id)));

    return NextResponse.json({ message: "Stajalište uspešno obrisano" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}