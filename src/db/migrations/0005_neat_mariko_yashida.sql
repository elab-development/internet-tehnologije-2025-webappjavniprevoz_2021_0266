ALTER TABLE `linija` DROP FOREIGN KEY `fk_idTipPrevoza1`;
--> statement-breakpoint
ALTER TABLE `linijanastajalistu` DROP FOREIGN KEY `fk_idLinije`;
--> statement-breakpoint
ALTER TABLE `linijanastajalistu` DROP FOREIGN KEY `fk_idStajalista`;
--> statement-breakpoint
ALTER TABLE `omiljenastajalista` DROP FOREIGN KEY `fk_korisnik1`;
--> statement-breakpoint
ALTER TABLE `omiljenastajalista` DROP FOREIGN KEY `fk_stajalista`;
--> statement-breakpoint
ALTER TABLE `omiljenjelinije` DROP FOREIGN KEY `fk_korisnik`;
--> statement-breakpoint
ALTER TABLE `omiljenjelinije` DROP FOREIGN KEY `fk_linija`;
--> statement-breakpoint
ALTER TABLE `korisnik` MODIFY COLUMN `idKorisnik` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `korisnik` MODIFY COLUMN `uuid_token` varchar(255);--> statement-breakpoint
ALTER TABLE `korisnik` MODIFY COLUMN `reset_password_token` varchar(255);--> statement-breakpoint
ALTER TABLE `korisnik` MODIFY COLUMN `token_expires_at` datetime;--> statement-breakpoint
ALTER TABLE `linija` MODIFY COLUMN `idLinije` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `linija` MODIFY COLUMN `idTipVozila` int NOT NULL;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` MODIFY COLUMN `idLinijaStajaliste` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` MODIFY COLUMN `idLinije` int NOT NULL;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` MODIFY COLUMN `idStajalista` int NOT NULL;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` MODIFY COLUMN `Smer` int NOT NULL;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` MODIFY COLUMN `redniBroj` int NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` MODIFY COLUMN `idOmiljenaStajalista` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` MODIFY COLUMN `idKorisnik` int NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` MODIFY COLUMN `idStajalista` int NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` MODIFY COLUMN `idOmiljeneLinije` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` MODIFY COLUMN `idKorisnik` int NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` MODIFY COLUMN `idLinije` int NOT NULL;--> statement-breakpoint
ALTER TABLE `stajaliste` MODIFY COLUMN `idStajalista` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `stajaliste` MODIFY COLUMN `brojStajalista` int NOT NULL;--> statement-breakpoint
ALTER TABLE `tipprevoza` MODIFY COLUMN `idTipaVozila` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `korisnik` ADD PRIMARY KEY(`idKorisnik`);--> statement-breakpoint
ALTER TABLE `linija` ADD PRIMARY KEY(`idLinije`);--> statement-breakpoint
ALTER TABLE `linijanastajalistu` ADD PRIMARY KEY(`idLinijaStajaliste`);--> statement-breakpoint
ALTER TABLE `omiljenastajalista` ADD PRIMARY KEY(`idOmiljenaStajalista`);--> statement-breakpoint
ALTER TABLE `omiljenjelinije` ADD PRIMARY KEY(`idOmiljeneLinije`);--> statement-breakpoint
ALTER TABLE `stajaliste` ADD PRIMARY KEY(`idStajalista`);--> statement-breakpoint
ALTER TABLE `tipprevoza` ADD PRIMARY KEY(`idTipaVozila`);--> statement-breakpoint
ALTER TABLE `korisnik` ADD `admin` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `korisnik` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `linija` ADD `brojLinije` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `linija` ADD CONSTRAINT `linija_idTipVozila_tipprevoza_idTipaVozila_fk` FOREIGN KEY (`idTipVozila`) REFERENCES `tipprevoza`(`idTipaVozila`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` ADD CONSTRAINT `linijanastajalistu_idLinije_linija_idLinije_fk` FOREIGN KEY (`idLinije`) REFERENCES `linija`(`idLinije`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` ADD CONSTRAINT `linijanastajalistu_idStajalista_stajaliste_idStajalista_fk` FOREIGN KEY (`idStajalista`) REFERENCES `stajaliste`(`idStajalista`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` ADD CONSTRAINT `omiljenastajalista_idKorisnik_korisnik_idKorisnik_fk` FOREIGN KEY (`idKorisnik`) REFERENCES `korisnik`(`idKorisnik`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` ADD CONSTRAINT `omiljenastajalista_idStajalista_stajaliste_idStajalista_fk` FOREIGN KEY (`idStajalista`) REFERENCES `stajaliste`(`idStajalista`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` ADD CONSTRAINT `omiljenjelinije_idKorisnik_korisnik_idKorisnik_fk` FOREIGN KEY (`idKorisnik`) REFERENCES `korisnik`(`idKorisnik`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` ADD CONSTRAINT `omiljenjelinije_idLinije_linija_idLinije_fk` FOREIGN KEY (`idLinije`) REFERENCES `linija`(`idLinije`) ON DELETE no action ON UPDATE no action;