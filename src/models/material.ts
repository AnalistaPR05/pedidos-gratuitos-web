export interface Material {
  codigo: string;
  textoMaterial: string;
  lo: string;
  ambito: string;
  categoria: string;
  linea: string;
  familia: string;
  modelo: string;
  genero: string;
  estadoVenta: string;
  stock: number;
  precio1: number;
  precio2: number;
  precio3: number;
  color: string;
  nombreMostrar: string;
}

export interface MaterialFiltro {
  ambito?: string;
  categoria?: string;
  linea?: string;
  familia?: string;
  modelo?: string;
  talla?: string;
  busqueda?: string;
}
