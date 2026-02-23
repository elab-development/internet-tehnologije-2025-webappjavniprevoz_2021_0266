import { NextResponse } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Prevezi.me API Dokumentacija',
      version: '1.0.0',
      description: 'API specifikacija za upravljanje linijama, stajalištima i korisnicima',
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
          description: 'JWT token u auth cookie-ju (Middleware proverava ovaj cookie)',
        },
      },
      schemas: {
        Korisnik: {
          type: 'object',
          properties: {
            idKorisnik: { type: 'integer' },
            korisnickoIme: { type: 'string' },
            email: { type: 'string' },
            admin: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Linija: {
          type: 'object',
          properties: {
            idLinije: { type: 'integer' },
            naziv: { type: 'string' },
            brojLinije: { type: 'string' },
            pocetnaStanica: { type: 'string' },
            krajnjaStanica: { type: 'string' },
            idTipVozila: { type: 'integer' },
          },
        },
        Stajaliste: {
          type: 'object',
          properties: {
            idStajalista: { type: 'integer' },
            naziv: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            brojStajalista: { type: 'integer' },
          },
        },
        LinijaNaStajalistu: {
          type: 'object',
          properties: {
            idLinijaStajaliste: { type: 'integer' },
            idLinije: { type: 'integer' },
            idStajalista: { type: 'integer' },
            smer: { type: 'integer' },
            redniBroj: { type: 'integer' },
          },
        },
        OmiljenaStajalista: {
          type: 'object',
          properties: {
            idOmiljenaStajalista: { type: 'integer' },
            idKorisnik: { type: 'integer' },
            idStajalista: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        OmiljeneLinije: {
          type: 'object',
          properties: {
            idOmiljeneLinije: { type: 'integer' },
            idKorisnik: { type: 'integer' },
            idLinije: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        TipPrevoza: {
          type: 'object',
          properties: {
            idTipaVozila: { type: 'integer' },
            nazivTipaVozila: { type: 'string' },
          },
        },
      },
    },
    // Globalno primenjujemo auth na sve rute koje imaju 'security' tag
    security: [{ cookieAuth: [] }],
  },
  paths: {
      "/api/admin/korisnici": {
        "get": {
          "summary": "(Admin) Lista svih korisnika",
          "security": [{ "cookieAuth": [] }],
          "responses": {
            "200": {
              "description": "Uspešno",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": { "$ref": "#/components/schemas/Korisnik" }
                  }
                }
              }
            }
          }
        }
      },
    },   
  apis: []
};

const spec = swaggerJSDoc(options);

export async function GET() {
  try {
    console.log("Generišem Swagger specifikaciju...");
    const spec = swaggerJSDoc(options);
    
    if (!spec) {
      throw new Error("Swagger JSDoc je vratio prazan objekat");
    }

    return NextResponse.json(spec);
  } catch (error: any) {
    console.error("DETALJNA SWAGGER GREŠKA:", error);
    return NextResponse.json({ 
      error: "Greška na serveru", 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}