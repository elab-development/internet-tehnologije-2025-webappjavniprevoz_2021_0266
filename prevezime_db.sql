/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - prevezime_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`prevezime_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `prevezime_db`;

/*Table structure for table `korisnik` */

DROP TABLE IF EXISTS `korisnik`;

CREATE TABLE `korisnik` (
  `idKorisnik` int(11) NOT NULL AUTO_INCREMENT,
  `korisnickoIme` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sifra` varchar(255) NOT NULL,
  `uuid_token` varchar(255) DEFAULT NULL,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`idKorisnik`),
  UNIQUE KEY `unique_mail` (`email`),
  UNIQUE KEY `unique_uuid_token` (`uuid_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `korisnik` */

/*Table structure for table `linija` */

DROP TABLE IF EXISTS `linija`;

CREATE TABLE `linija` (
  `idLinije` int(11) NOT NULL AUTO_INCREMENT,
  `naziv` varchar(255) NOT NULL,
  `pocetnaStanica` varchar(255) NOT NULL,
  `krajnjaStanica` varchar(255) NOT NULL,
  `idTipVozila` int(11) NOT NULL,
  PRIMARY KEY (`idLinije`),
  KEY `fk_idTipPrevoza1` (`idTipVozila`),
  CONSTRAINT `fk_idTipPrevoza1` FOREIGN KEY (`idTipVozila`) REFERENCES `tipprevoza` (`idTipaVozila`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `linija` */

/*Table structure for table `linijanastajalistu` */

DROP TABLE IF EXISTS `linijanastajalistu`;

CREATE TABLE `linijanastajalistu` (
  `idLinijaStajaliste` int(11) NOT NULL AUTO_INCREMENT,
  `idLinije` int(11) NOT NULL,
  `idStajalista` int(11) NOT NULL,
  `Smer` int(11) NOT NULL,
  `redniBroj` int(11) NOT NULL,
  PRIMARY KEY (`idLinijaStajaliste`),
  KEY `fk_idLinije` (`idLinije`),
  KEY `fk_idStajalista` (`idStajalista`),
  CONSTRAINT `fk_idLinije` FOREIGN KEY (`idLinije`) REFERENCES `linija` (`idLinije`),
  CONSTRAINT `fk_idStajalista` FOREIGN KEY (`idStajalista`) REFERENCES `stajaliste` (`idStajalista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `linijanastajalistu` */

/*Table structure for table `omiljenastajalista` */

DROP TABLE IF EXISTS `omiljenastajalista`;

CREATE TABLE `omiljenastajalista` (
  `idOmiljenaStajalista` int(11) NOT NULL AUTO_INCREMENT,
  `idKorisnik` int(11) NOT NULL,
  `idStajalista` int(11) NOT NULL,
  PRIMARY KEY (`idOmiljenaStajalista`),
  KEY `fk_korisnik1` (`idKorisnik`),
  KEY `fk_stajalista` (`idStajalista`),
  CONSTRAINT `fk_korisnik1` FOREIGN KEY (`idKorisnik`) REFERENCES `korisnik` (`idKorisnik`),
  CONSTRAINT `fk_stajalista` FOREIGN KEY (`idStajalista`) REFERENCES `stajaliste` (`idStajalista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `omiljenastajalista` */

/*Table structure for table `omiljenjelinije` */

DROP TABLE IF EXISTS `omiljenjelinije`;

CREATE TABLE `omiljenjelinije` (
  `idOmiljeneLinije` int(11) NOT NULL AUTO_INCREMENT,
  `idKorisnik` int(11) NOT NULL,
  `idLinije` int(11) NOT NULL,
  PRIMARY KEY (`idOmiljeneLinije`),
  KEY `fk_korisnik` (`idKorisnik`),
  KEY `fk_linija` (`idLinije`),
  CONSTRAINT `fk_korisnik` FOREIGN KEY (`idKorisnik`) REFERENCES `korisnik` (`idKorisnik`),
  CONSTRAINT `fk_linija` FOREIGN KEY (`idLinije`) REFERENCES `linija` (`idLinije`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `omiljenjelinije` */

/*Table structure for table `stajaliste` */

DROP TABLE IF EXISTS `stajaliste`;

CREATE TABLE `stajaliste` (
  `idStajalista` int(11) NOT NULL AUTO_INCREMENT,
  `naziv` varchar(255) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `brojStajalista` int(10) NOT NULL,
  PRIMARY KEY (`idStajalista`),
  UNIQUE KEY `unique_brojStajalista` (`brojStajalista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `stajaliste` */

/*Table structure for table `tipprevoza` */

DROP TABLE IF EXISTS `tipprevoza`;

CREATE TABLE `tipprevoza` (
  `idTipaVozila` int(11) NOT NULL AUTO_INCREMENT,
  `nazivTipaVozila` varchar(255) NOT NULL,
  PRIMARY KEY (`idTipaVozila`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tipprevoza` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
