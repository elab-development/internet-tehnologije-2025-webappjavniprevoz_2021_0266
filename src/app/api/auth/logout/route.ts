import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(){
    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),{ status: 303});
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