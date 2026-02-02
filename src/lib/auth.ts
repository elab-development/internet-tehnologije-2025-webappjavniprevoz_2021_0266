import { secureHeapUsed } from "crypto";
import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE="auth";

const JWT_SECRET = process.env.JWT_SECRET!;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET nije definisan u .env fajlu");
}

export type JwtUserClaims = {
    sub: string;  //id
    korisnickoIme?: string;
    email: string;
}

export function signAuthToken(claims: JwtUserClaims){
    return jwt.sign(claims, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d"
});}

export function verifyAuthToken(token: string){
    const payload= jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserClaims;
    if(!payload || !payload.sub || !payload.email){
        throw new Error("Nevalidan token");
    }

    return{
        sub: payload.sub,
        korisnickoIme: payload.korisnickoIme,
        email: payload.email
    }
}

export function cookieOpts(){
    return {
        httpOnly: true, //xss zastita
        sameSite: "lax" as const, //csfr zastita
        secure: process.env.NODE_ENV === "production", //samo preko https u produkciji
        maxAge: 60 * 60 * 24 * 7, // 1 nedelja
        path: "/"
    }
}
