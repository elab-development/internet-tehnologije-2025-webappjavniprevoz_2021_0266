RENAME TABLE `omiljenjelinije` TO `omiljenelinije`;--> statement-breakpoint
ALTER TABLE `omiljenelinije` DROP FOREIGN KEY `omiljenjelinije_idKorisnik_korisnik_idKorisnik_fk`;
--> statement-breakpoint
ALTER TABLE `omiljenelinije` DROP FOREIGN KEY `omiljenjelinije_idLinije_linija_idLinije_fk`;
--> statement-breakpoint
ALTER TABLE `omiljenelinije` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `omiljenelinije` ADD PRIMARY KEY(`idOmiljeneLinije`);--> statement-breakpoint
ALTER TABLE `linija` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `stajaliste` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenelinije` ADD CONSTRAINT `omiljenelinije_idKorisnik_korisnik_idKorisnik_fk` FOREIGN KEY (`idKorisnik`) REFERENCES `korisnik`(`idKorisnik`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `omiljenelinije` ADD CONSTRAINT `omiljenelinije_idLinije_linija_idLinije_fk` FOREIGN KEY (`idLinije`) REFERENCES `linija`(`idLinije`) ON DELETE no action ON UPDATE no action;