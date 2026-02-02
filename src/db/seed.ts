import { db } from "./index"
import { korisnik } from "./schema"
import bcrypt from "bcrypt"

const hash = await bcrypt.hash("test", 10);
await db.transaction(async (tx)=>{
    await tx.insert(korisnik).values([
        {
            idKorisnik: 1,
            korisnickoIme: "testkorisnik",
            email: "test@gmail.com",
            sifra: hash,
        },
        {
            idKorisnik: 2,
            korisnickoIme: "testkorisnik2",
            email: "test2@gmail.com",
            sifra: hash,
        }
    ])
})