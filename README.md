# Informacioni sistem javnog prevoza - Prevezi.me

Projekat predstavlja Full-stack aplikaciju za upravljanje i pregled linija gradskog prevoza, stajališta i korisničkih favorita. Sistem je realizovan korišćenjem Next.js 15 radnog okvira, Drizzle ORM-a i MySQL baze podataka.

## Tehnološki stack

* **Frontend:** Next.js (App Router), Tailwind CSS.
* **Backend:** Next.js API Routes, JWT Autentifikacija putem cookie-ja.
* **Baza podataka:** MySQL.
* **Eksterni API:** Google Maps API (prikaz ruta) i Google Charts (statistika).
* **Dokumentacija:** Swagger UI (OpenAPI 3.0).
* **Infrastruktura:** Docker i Docker Compose.

## Podela zaduženja na projektu

Rad na projektu je podeljen u dve logičke celine:

### Modul za mape, infrastrukturu i administraciju prevoza:
* **Google Maps integracija:** Implementacija mape za dinamički prikaz linija i stajališta na osnovu geografskih koordinata.
* **Logika smerova:** Razvoj funkcionalnosti za promenu smera linije (Smer 0 i Smer 1) i dinamičko sortiranje redosleda stajališta.
* **API Dokumentacija:** Kreiranje kompletne Swagger/OpenAPI specifikacije i integracija Swagger UI okruženja u Next.js.
* **CRUD tipova prevoza:** Razvoj modula za definisanje i upravljanje kategorijama vozila (autobusi, tramvaji itd.).
* **Agregacija podataka:** Realizacija SQL upita sa višestrukim spajanjem tabela (Join) za generisanje plana puta.
* **Dockerizacija:** Kreiranje Dockerfile-a i konfigurisanje servisa kroz Docker Compose za automatizovano podizanje baze i aplikacije.

### Modul za autentifikaciju i korisničke funkcije:
* **Autentifikacija:** Implementacija registracije, prijave korisnika i zaštita ruta korišćenjem middleware-a.
* **Admin panel:** Razvoj interfejsa za upravljanje korisničkim nalozima i administratorskim privilegijama.
* **Sistem favorita:** Logika za čuvanje i prikaz omiljenih linija i stajališta za ulogovane korisnike.
* **Vizuelizacija podataka:** Prikaz statistike baze podataka putem Google Charts grafikona.

## Instalacija i pokretanje

Projekat je u potpunosti dockerizovan radi lakše replikacije okruženja.

1.  Konfiguracija `.env` fajla (Parametri baze, JWT secret, Google API ključ).
2.  Pokretanje sistema komandom:
    ```bash
    docker-compose up --build
    ```
3.  Pristup aplikaciji putem adrese: `http://localhost:3000`.

## API Dokumentacija

Detaljan pregled svih API endpoint-a nalazi se u Swagger dokumentaciji. Dokumentaciji se pristupa putem dugmeta u navigaciji admin panela ili direktno na adresi:
`http://localhost:3000/api-docs`

Dokumentacija obuhvata specifikacije za:
* **Autentifikaciju:** Registracija, prijava i odjava.
* **Linije i stajališta:** Pregled i dodavanje novih entiteta.
* **Plan puta:** Agregirane rute koje povezuju stanice sa linijama.
* **Korisničke module:** Upravljanje favoritima i admin pregled korisnika.