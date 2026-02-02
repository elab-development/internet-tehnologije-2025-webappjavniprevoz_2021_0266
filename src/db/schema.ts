import { mysqlTable, mysqlSchema, AnyMySqlColumn, unique, int, varchar, datetime, foreignKey, double, timestamp,  boolean as mysqlBoolean} from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const korisnik = mysqlTable("korisnik", {
    idKorisnik: int("idKorisnik").primaryKey().autoincrement().notNull(),
    korisnickoIme: varchar("korisnickoIme", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    sifra: varchar("sifra", { length: 255 }).notNull(),
    admin: mysqlBoolean("admin").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
    uuidToken: varchar("uuid_token", { length: 255 }),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    tokenExpiresAt: datetime("token_expires_at", { mode: 'string'}),
},
(table) => [
    unique("unique_mail").on(table.email),
    unique("unique_uuid_token").on(table.uuidToken),
]);

export const linija = mysqlTable("linija", {
    idLinije: int("idLinije").primaryKey().autoincrement().notNull(),
    naziv: varchar({ length: 255 }).notNull(),
    brojLinije: varchar({ length: 255 }).notNull(),
    pocetnaStanica: varchar({ length: 255 }).notNull(),
    krajnjaStanica: varchar({ length: 255 }).notNull(),
    idTipVozila: int().notNull().references(() => tipprevoza.idTipaVozila, { onDelete: "restrict", onUpdate: "cascade" } ),
});

export const linijanastajalistu = mysqlTable("linijanastajalistu", {
    idLinijaStajaliste: int("idLinijaStajaliste").primaryKey().autoincrement().notNull(),
    idLinije: int().notNull().references(() => linija.idLinije),
    idStajalista: int().notNull().references(() => stajaliste.idStajalista),
    smer: int("Smer").notNull(),
    redniBroj: int().notNull(),
});

export const omiljenastajalista = mysqlTable("omiljenastajalista", {
    idOmiljenaStajalista: int("idOmiljenaStajalista").primaryKey().autoincrement().notNull(),
    idKorisnik: int().notNull().references(() => korisnik.idKorisnik),
    idStajalista: int().notNull().references(() => stajaliste.idStajalista),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const omiljenelinije = mysqlTable("omiljenelinije", {
    idOmiljeneLinije: int("idOmiljeneLinije").primaryKey().autoincrement().notNull(),
    idKorisnik: int().notNull().references(() => korisnik.idKorisnik),
    idLinije: int().notNull().references(() => linija.idLinije),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stajaliste = mysqlTable("stajaliste", {
    idStajalista: int("idStajalista").primaryKey().autoincrement().notNull(),
    naziv: varchar({ length: 255 }).notNull(),
    latitude: double().notNull(),
    longitude: double().notNull(),
    brojStajalista: int().notNull(),
},
(table) => [
    unique("unique_brojStajalista").on(table.brojStajalista),
]);

export const tipprevoza = mysqlTable("tipprevoza", {
    idTipaVozila: int("idTipaVozila").primaryKey().autoincrement().notNull(),
    nazivTipaVozila: varchar({ length: 255 }).notNull(),
});

import { relations } from "drizzle-orm/relations";


export const linijaRelations = relations(linija, ({one, many}) => ({
	tipprevoza: one(tipprevoza, {
		fields: [linija.idTipVozila],
		references: [tipprevoza.idTipaVozila]
	}),
	linijanastajalistus: many(linijanastajalistu),
	omiljenelinijes: many(omiljenelinije),
}));

export const tipprevozaRelations = relations(tipprevoza, ({many}) => ({
	linijas: many(linija),
}));

export const linijanastajalistuRelations = relations(linijanastajalistu, ({one}) => ({
	linija: one(linija, {
		fields: [linijanastajalistu.idLinije],
		references: [linija.idLinije]
	}),
	stajaliste: one(stajaliste, {
		fields: [linijanastajalistu.idStajalista],
		references: [stajaliste.idStajalista]
	}),
}));

export const stajalisteRelations = relations(stajaliste, ({many}) => ({
	linijanastajalistus: many(linijanastajalistu),
	omiljenastajalistas: many(omiljenastajalista),
}));

export const omiljenastajalistaRelations = relations(omiljenastajalista, ({one}) => ({
	korisnik: one(korisnik, {
		fields: [omiljenastajalista.idKorisnik],
		references: [korisnik.idKorisnik]
	}),
	stajaliste: one(stajaliste, {
		fields: [omiljenastajalista.idStajalista],
		references: [stajaliste.idStajalista]
	}),
}));

export const korisnikRelations = relations(korisnik, ({many}) => ({
	omiljenastajalistas: many(omiljenastajalista),
	omiljenjelinijes: many(omiljenelinije),
}));

export const omiljenelinijeRelations = relations(omiljenelinije, ({one}) => ({
	korisnik: one(korisnik, {
		fields: [omiljenelinije.idKorisnik],
		references: [korisnik.idKorisnik]
	}),
	linija: one(linija, {
		fields: [omiljenelinije.idLinije],
		references: [linija.idLinije]
	}),
}));