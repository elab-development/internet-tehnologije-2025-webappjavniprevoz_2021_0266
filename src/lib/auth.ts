import { secureHeapUsed } from "crypto";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export const AUTH_COOKIE="auth";

const JWT_SECRET = process.env.JWT_SECRET!;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET nije definisan u .env fajlu");
}

export type JwtUserClaims = {
    sub: string;  
    korisnickoIme?: string;
    email: string;
    admin: boolean;
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
        email: payload.email,
        admin: payload.admin
    }
}
export async function dobijIdIzTokena() {
  try {
    const cookieStore = await cookies();
    
    const token = cookieStore.get("auth")?.value; 

    if (!token) return null;

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { 
      sub: string; 
      email: string 
    };
    
    
    return decoded.sub ? Number(decoded.sub) : null;
  } catch (error) {
    console.error("JWT Error:", error);
    return null;
  }
}
export async function daLiJeAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) return false;

    const user = verifyAuthToken(token);

    return !!user.admin;
  } catch (error) {
    return false;
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
