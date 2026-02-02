import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import bcrypt from "bcrypt";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body={
    email: string;
    sifra: string;
    korisnickoIme: string;
}

export async function POST(request: Request) {
    //parsiranje zahteva
    const { email, sifra, korisnickoIme } = (await request.json()) as Body;
    //validiranje promenljivih
    if (!email || !sifra || !korisnickoIme) {
        return NextResponse.json({error: "Nedostaju podaci"}, { status: 400 });
    }
    //provera u bazi
    const exists= await db.select().from(korisnik).where(eq(korisnik.email, email));
    
    if(exists.length){
        return NextResponse.json({error: "Imejl je vec iskoriscen"}, { status: 400 });
    }
    // sifra
    const sifraHash = await bcrypt.hash(sifra, 10);

    //kreiranje korisnika
    const [k]= await db.insert(korisnik).values({
        email: email,
        sifra: sifraHash,
        korisnickoIme: korisnickoIme
    })
    const noviKorisnikId = k.insertId;
    const [noviKorisnik] = await db.select().from(korisnik).where(eq(korisnik.idKorisnik, noviKorisnikId));

    //generisanje tokena
    const token = signAuthToken({
        sub: noviKorisnik.idKorisnik.toString(),
        email: noviKorisnik.email,
        korisnickoIme: noviKorisnik.korisnickoIme,
        admin: noviKorisnik.admin
    })
    //stavljanje kolacica
    const response = NextResponse.json({message: "Uspesno registrovan korisnik", idKorisnik: noviKorisnik.idKorisnik, email: noviKorisnik.email}, {status:200});
    response.cookies.set(AUTH_COOKIE, token, cookieOpts());
    //povrat korisnickog naloga
    return response;
}    