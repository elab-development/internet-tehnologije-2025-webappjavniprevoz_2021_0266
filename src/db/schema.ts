import { mysqlTable, mysqlSchema, AnyMySqlColumn, unique, int, varchar, datetime, foreignKey, double } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const korisnik = mysqlTable("korisnik", {
	idKorisnik: int().autoincrement().notNull(),
	korisnickoIme: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	sifra: varchar({ length: 255 }).notNull(),
	uuidToken: varchar("uuid_token", { length: 255 }).default('NULL'),
	resetPasswordToken: varchar("reset_password_token", { length: 255 }).default('NULL'),
	tokenExpiresAt: datetime("token_expires_at", { mode: 'string'}).default('NULL'),
},
(table) => [
	unique("unique_mail").on(table.email),
	unique("unique_uuid_token").on(table.uuidToken),
]);

export const linija = mysqlTable("linija", {
	idLinije: int().autoincrement().notNull(),
	naziv: varchar({ length: 255 }).notNull(),
	pocetnaStanica: varchar({ length: 255 }).notNull(),
	krajnjaStanica: varchar({ length: 255 }).notNull(),
	idTipVozila: int().notNull().references(() => tipprevoza.idTipaVozila, { onDelete: "restrict", onUpdate: "cascade" } ),
});

export const linijanastajalistu = mysqlTable("linijanastajalistu", {
	idLinijaStajaliste: int().autoincrement().notNull(),
	idLinije: int().notNull().references(() => linija.idLinije, { onDelete: "restrict", onUpdate: "restrict" } ),
	idStajalista: int().notNull().references(() => stajaliste.idStajalista, { onDelete: "restrict", onUpdate: "restrict" } ),
	smer: int("Smer").notNull(),
	redniBroj: int().notNull(),
});

export const omiljenastajalista = mysqlTable("omiljenastajalista", {
	idOmiljenaStajalista: int().autoincrement().notNull(),
	idKorisnik: int().notNull().references(() => korisnik.idKorisnik, { onDelete: "restrict", onUpdate: "restrict" } ),
	idStajalista: int().notNull().references(() => stajaliste.idStajalista, { onDelete: "restrict", onUpdate: "restrict" } ),
});

export const omiljenjelinije = mysqlTable("omiljenjelinije", {
	idOmiljeneLinije: int().autoincrement().notNull(),
	idKorisnik: int().notNull().references(() => korisnik.idKorisnik, { onDelete: "restrict", onUpdate: "restrict" } ),
	idLinije: int().notNull().references(() => linija.idLinije, { onDelete: "restrict", onUpdate: "restrict" } ),
});

export const stajaliste = mysqlTable("stajaliste", {
	idStajalista: int().autoincrement().notNull(),
	naziv: varchar({ length: 255 }).notNull(),
	latitude: double().notNull(),
	longitude: double().notNull(),
	brojStajalista: int().notNull(),
},
(table) => [
	unique("unique_brojStajalista").on(table.brojStajalista),
]);

export const tipprevoza = mysqlTable("tipprevoza", {
	idTipaVozila: int().autoincrement().notNull(),
	nazivTipaVozila: varchar({ length: 255 }).notNull(),
});
