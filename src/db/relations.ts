import { relations } from "drizzle-orm/relations";
import { tipprevoza, linija, linijanastajalistu, stajaliste, korisnik, omiljenastajalista, omiljenjelinije } from "./schema";

export const linijaRelations = relations(linija, ({one, many}) => ({
	tipprevoza: one(tipprevoza, {
		fields: [linija.idTipVozila],
		references: [tipprevoza.idTipaVozila]
	}),
	linijanastajalistus: many(linijanastajalistu),
	omiljenjelinijes: many(omiljenjelinije),
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
	omiljenjelinijes: many(omiljenjelinije),
}));

export const omiljenjelinijeRelations = relations(omiljenjelinije, ({one}) => ({
	korisnik: one(korisnik, {
		fields: [omiljenjelinije.idKorisnik],
		references: [korisnik.idKorisnik]
	}),
	linija: one(linija, {
		fields: [omiljenjelinije.idLinije],
		references: [linija.idLinije]
	}),
}));