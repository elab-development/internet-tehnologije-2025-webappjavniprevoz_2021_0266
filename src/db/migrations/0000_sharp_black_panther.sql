-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `korisnik` (
	`idKorisnik` int(11) AUTO_INCREMENT NOT NULL,
	`korisnickoIme` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`sifra` varchar(255) NOT NULL,
	`uuid_token` varchar(255) DEFAULT 'NULL',
	`reset_password_token` varchar(255) DEFAULT 'NULL',
	`token_expires_at` datetime DEFAULT 'NULL',
	CONSTRAINT `unique_mail` UNIQUE(`email`),
	CONSTRAINT `unique_uuid_token` UNIQUE(`uuid_token`)
);
--> statement-breakpoint
CREATE TABLE `linija` (
	`idLinije` int(11) AUTO_INCREMENT NOT NULL,
	`naziv` varchar(255) NOT NULL,
	`pocetnaStanica` varchar(255) NOT NULL,
	`krajnjaStanica` varchar(255) NOT NULL,
	`idTipVozila` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `linijanastajalistu` (
	`idLinijaStajaliste` int(11) AUTO_INCREMENT NOT NULL,
	`idLinije` int(11) NOT NULL,
	`idStajalista` int(11) NOT NULL,
	`Smer` int(11) NOT NULL,
	`redniBroj` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `omiljenastajalista` (
	`idOmiljenaStajalista` int(11) AUTO_INCREMENT NOT NULL,
	`idKorisnik` int(11) NOT NULL,
	`idStajalista` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `omiljenjelinije` (
	`idOmiljeneLinije` int(11) AUTO_INCREMENT NOT NULL,
	`idKorisnik` int(11) NOT NULL,
	`idLinije` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stajaliste` (
	`idStajalista` int(11) AUTO_INCREMENT NOT NULL,
	`naziv` varchar(255) NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`brojStajalista` int(10) NOT NULL,
	CONSTRAINT `unique_brojStajalista` UNIQUE(`brojStajalista`)
);
--> statement-breakpoint
CREATE TABLE `tipprevoza` (
	`idTipaVozila` int(11) AUTO_INCREMENT NOT NULL,
	`nazivTipaVozila` varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `linija` ADD CONSTRAINT `fk_idTipPrevoza1` FOREIGN KEY (`idTipVozila`) REFERENCES `tipprevoza`(`idTipaVozila`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` ADD CONSTRAINT `fk_idLinije` FOREIGN KEY (`idLinije`) REFERENCES `linija`(`idLinije`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `linijanastajalistu` ADD CONSTRAINT `fk_idStajalista` FOREIGN KEY (`idStajalista`) REFERENCES `stajaliste`(`idStajalista`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` ADD CONSTRAINT `fk_korisnik1` FOREIGN KEY (`idKorisnik`) REFERENCES `korisnik`(`idKorisnik`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `omiljenastajalista` ADD CONSTRAINT `fk_stajalista` FOREIGN KEY (`idStajalista`) REFERENCES `stajaliste`(`idStajalista`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` ADD CONSTRAINT `fk_korisnik` FOREIGN KEY (`idKorisnik`) REFERENCES `korisnik`(`idKorisnik`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `omiljenjelinije` ADD CONSTRAINT `fk_linija` FOREIGN KEY (`idLinije`) REFERENCES `linija`(`idLinije`) ON DELETE restrict ON UPDATE restrict;
*/