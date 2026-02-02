import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(){
    const response = NextResponse.json({ok: true}, {status:200});
    response.cookies.set(AUTH_COOKIE, "",{
        httpOnly: true, //xss zastita
        sameSite: "lax" as const, //csfr zastita
        secure: process.env.NODE_ENV === "production", //samo preko https u produkciji
        maxAge: 0, //brise kolacic
        path: "/",
        expires: new Date(0)
    });
    return response;
}