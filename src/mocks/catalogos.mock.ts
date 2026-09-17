import type { Ambito, Categoria, Linea, Familia, Modelo } from "../models/catalogos";

export const ambitosMock: Ambito[] = [
  {
    "id": 1,
    "nombre": "ESCOLAR"
  },
  {
    "id": 2,
    "nombre": "TRABAJO"
  },
  {
    "id": 3,
    "nombre": "DEPORTES"
  }
];

export const categoriasMock: Categoria[] = [
  {
    "id": 1,
    "idAmbito": 1,
    "nombre": "CULTURA FISICA"
  },
  {
    "id": 2,
    "idAmbito": 2,
    "nombre": "AGRICOLA"
  },
  {
    "id": 3,
    "idAmbito": 3,
    "nombre": "SOCCER"
  },
  {
    "id": 4,
    "idAmbito": 1,
    "nombre": "DIARIO"
  }
];

export const lineasMock: Linea[] = [
  {
    "id": 1,
    "idCategoria": 1,
    "nombre": "ECONOMICO"
  },
  {
    "id": 2,
    "idCategoria": 2,
    "nombre": "ECONOMICO"
  },
  {
    "id": 3,
    "idCategoria": 3,
    "nombre": "ENHANCED"
  },
  {
    "id": 4,
    "idCategoria": 4,
    "nombre": "PREMIUM"
  }
];

export const familiasMock: Familia[] = [
  {
    "id": 1,
    "idLinea": 1,
    "nombre": "COLEGIAL"
  },
  {
    "id": 2,
    "idLinea": 2,
    "nombre": "ANDINA"
  },
  {
    "id": 3,
    "idLinea": 3,
    "nombre": "1938"
  },
  {
    "id": 4,
    "idLinea": 4,
    "nombre": "ABEL"
  }
];

export const modelosMock: Modelo[] = [
  {
    "id": 1,
    "idFamilia": 1,
    "nombre": "COLEGIAL CLASICO"
  },
  {
    "id": 2,
    "idFamilia": 2,
    "nombre": "ANDINA CLASICA"
  },
  {
    "id": 3,
    "idFamilia": 3,
    "nombre": "1938 CLEATS"
  },
  {
    "id": 4,
    "idFamilia": 4,
    "nombre": "ABEL"
  }
];

