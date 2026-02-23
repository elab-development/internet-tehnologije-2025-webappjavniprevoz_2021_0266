import { NextResponse } from 'next/server';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Prevezi.me API Dokumentacija',
    version: '1.0.0',
    description: 'Kompletna dokumentacija za sistem javnog prevoza. Sadrži rute za upravljanje linijama, stajalištima, korisnicima i favoritima.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Lokalni razvojni server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'auth',
        description: 'JWT token u cookie-ju.',
      },
    },
  },
  paths: {

    "/api/auth/register": {
      "post": {
        "tags": ["Autentifikacija"],
        "summary": "Registracija korisnika",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "sifra", "korisnickoIme"],
                "properties": {
                  "email": { "type": "string", "example": "novi@user.com" },
                  "sifra": { "type": "string", "example": "lozinka123" },
                  "korisnickoIme": { "type": "string", "example": "Marko" }
                }
              }
            }
          }
        },
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/api/auth/login": {
      "post": {
        "tags": ["Autentifikacija"],
        "summary": "Prijava korisnika",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "sifra"],
                "properties": {
                  "email": { "type": "string", "example": "admin@gmail.com" },
                  "sifra": { "type": "string", "example": "admin123" }
                }
              }
            }
          }
        },
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/api/auth/logout": {
      "post": {
        "tags": ["Autentifikacija"],
        "summary": "Odjava",
        "responses": { "303": { "description": "Redirekcija" } }
      }
    },

    "/api/linije": {
      "get": {
        "tags": ["Linije"],
        "summary": "Pregled svih linija sa tipom vozila",
        "responses": { "200": { "description": "OK" } }
      },
      "post": {
        "tags": ["Linije"],
        "summary": "Kreiranje nove linije",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "naziv": { "type": "string", "example": "Zeleni Venac - Zemun" },
                  "brojLinije": { "type": "string", "example": "15" },
                  "pocetnaStanica": { "type": "string", "example": "Zeleni Venac" },
                  "krajnjaStanica": { "type": "string", "example": "Zemun" },
                  "idTipVozila": { "type": "number", "example": 1 }
                }
              }
            }
          }
        },
        "responses": { "201": { "description": "Kreirano" } }
      }
    },


    "/api/stajalista": {
      "get": {
        "tags": ["Stajališta"],
        "summary": "Lista svih stajališta",
        "responses": { "200": { "description": "OK" } }
      },
      "post": {
        "tags": ["Stajališta"],
        "summary": "Dodavanje stajališta",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "naziv": { "type": "string" },
                  "latitude": { "type": "number" },
                  "longitude": { "type": "number" },
                  "brojStajalista": { "type": "number" }
                }
              }
            }
          }
        },
        "responses": { "200": { "description": "OK" } }
      }
    },

  
    "/api/linije-stajalista": {
      "get": {
        "tags": ["Plan Puta"],
        "summary": "Pregled stajališta po linijama",
        "responses": { "200": { "description": "OK" } }
      },
      "post": {
        "tags": ["Plan Puta"],
        "summary": "Dodaj stanicu na liniju",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "idLinije": { "type": "number" },
                  "idStajalista": { "type": "number" },
                  "smer": { "type": "number", "description": "0 ili 1" },
                  "redniBroj": { "type": "number" }
                }
              }
            }
          }
        },
        "responses": { "200": { "description": "OK" } }
      }
    },

    
    "/api/tipPrevoza": {
      "get": { "tags": ["Tipovi Prevoza"], "summary": "Svi tipovi prevoza", "responses": { "200": { "description": "OK" } } },
      "post": {
        "tags": ["Tipovi Prevoza"],
        "summary": "Novi tip prevoza",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "type": "object", "properties": { "nazivTipaVozila": { "type": "string" } } }
            }
          }
        },
        "responses": { "201": { "description": "OK" } }
      }
    },

   
    "/api/korisnik/omiljena-stajalista": {
      "get": { "tags": ["Favoriti"], "summary": "Korisnikova omiljena stajališta", "security": [{ "cookieAuth": [] }], "responses": { "200": { "description": "OK" } } },
      "post": {
        "tags": ["Favoriti"],
        "summary": "Dodaj stajalište u favorite",
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object", "properties": { "idStajalista": { "type": "number" } } } } }
        },
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/api/korisnik/omiljene-linije": {
      "get": { "tags": ["Favoriti"], "summary": "Korisnikove omiljene linije", "security": [{ "cookieAuth": [] }], "responses": { "200": { "description": "OK" } } },
      "post": {
        "tags": ["Favoriti"],
        "summary": "Dodaj liniju u favorite",
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object", "properties": { "idLinije": { "type": "number" } } } } }
        },
        "responses": { "200": { "description": "OK" } }
      }
    },

    "/api/admin/korisnici": {
      "get": {
        "tags": ["Admin Panel"],
        "summary": "Lista svih korisnika",
        "security": [{ "cookieAuth": [] }],
        "responses": { "200": { "description": "OK" } }
      }
    }
  }
};

export async function GET() {
  return NextResponse.json(swaggerSpec);
}