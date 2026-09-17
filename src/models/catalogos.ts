export interface Ambito {
  id: number;
  nombre: string;
}

export interface Categoria {
  id: number;
  idAmbito: number;
  nombre: string;
}

export interface Linea {
  id: number;
  idCategoria: number;
  nombre: string;
}

export interface Familia {
  id: number;
  idLinea: number;
  nombre: string;
}

export interface Modelo {
  id: number;
  idFamilia: number;
  nombre: string;
}
