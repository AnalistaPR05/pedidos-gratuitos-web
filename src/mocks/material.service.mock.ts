import { materialesMock } from "./material.mock";
import type { Material, MaterialFiltro } from "../models/material";

const normalizar = (valor?: string) =>
  (valor ?? "").trim().toLocaleLowerCase("es");

export async function buscarMaterialesMock(
  filtro: MaterialFiltro
): Promise<Material[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return materialesMock.filter((material) => {
    if (filtro.ambito && material.ambito !== filtro.ambito) return false;
    if (filtro.categoria && material.categoria !== filtro.categoria) return false;
    if (filtro.linea && material.linea !== filtro.linea) return false;
    if (filtro.familia && material.familia !== filtro.familia) return false;
    if (filtro.modelo && material.modelo !== filtro.modelo) return false;
    if (filtro.talla && material.lo !== filtro.talla) return false;

    if (filtro.busqueda) {
      const q = normalizar(filtro.busqueda);
      const contenido = normalizar([
        material.codigo,
        material.textoMaterial,
        material.modelo,
        material.color,
        material.genero,
        material.nombreMostrar,
      ].join(" "));

      if (!contenido.includes(q)) return false;
    }

    return true;
  });
}
