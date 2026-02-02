import { db } from "@/db";
import { linija } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await db.update(linija)
      .set(body)
      .where(eq(linija.idLinije, Number(id)));

    return NextResponse.json({ message: "Linija izmenjena" });
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
    await db.delete(linija).where(eq(linija.idLinije, Number(id)));
    return NextResponse.json({ message: "Linija obrisana" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}