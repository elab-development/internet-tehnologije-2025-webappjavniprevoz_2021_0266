import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import bcrypt from "bcrypt";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body={
    email: string;
    sifra: string;
}

export async function POST(request: Request) {
    //parsiranje zahteva
    const { email, sifra } = (await request.json()) as Body;
    //validiranje promenljivih
    if (!email || !sifra) {
        return NextResponse.json({error: "Email i sifra su obavezni"}, { status: 401 });
    }
    //provera u bazi
    const [k]= await db.select().from(korisnik).where(eq(korisnik.email, email));
    
    if(!k){
        return NextResponse.json({error: "Pogresan email ili sifra"}, { status: 401 });
    }
    //provera sifre
    const isPasswordValid = await bcrypt.compare(sifra, k.sifra)
    if(!isPasswordValid){
        return NextResponse.json({error: "Pogresan email ili sifra"}, { status: 401 });
    }

    //generisanje tokena
    const token = signAuthToken({
        sub: k.idKorisnik.toString(),
        email: k.email,
        korisnickoIme: k.korisnickoIme,
    })
    //stavljanje kolacica
    const response = NextResponse.json({message: "Uspesno logovanje", idKorisnik: k.idKorisnik, email: k.email}, {status:200});
    response.cookies.set(AUTH_COOKIE, token, cookieOpts());
    //povrat korisnickog naloga
    return response;
}    