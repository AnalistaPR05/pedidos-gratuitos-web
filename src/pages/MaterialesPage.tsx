import { useEffect, useMemo, useState } from "react";
import { ambitosMock, categoriasMock, familiasMock, lineasMock, modelosMock } from "../mocks/catalogos.mock";
import { materialesMock } from "../mocks/material.mock";
import { buscarMaterialesMock } from "../mocks/material.service.mock";
import type { Material } from "../models/material";
import "./MaterialesPage.css";

type FiltroKey = "ambito" | "categoria" | "linea" | "familia" | "modelo" | "talla";
type OrdenCampo = "nombre" | "codigo" | "stock";
type Direccion = "asc" | "desc";

type OpcionFiltro = {
  id: number;
  nombre: string;
  cantidad: number;
};

interface FiltroAcordeonProps {
  titulo: string;
  abierto: boolean;
  opciones: OpcionFiltro[];
  seleccionado: number | null;
  onToggle: () => void;
  onSeleccionar: (id: number) => void;
  mensajeVacio?: string;
}

function FiltroAcordeon({
  titulo,
  abierto,
  opciones,
  seleccionado,
  onToggle,
  onSeleccionar,
  mensajeVacio = "No hay opciones disponibles",
}: FiltroAcordeonProps) {
  return (
    <section className={`filtro ${abierto ? "filtro--abierto" : ""}`}>
      <button className="filtro__cabecera" type="button" onClick={onToggle}>
        <span>{titulo}</span>
        <span className="filtro__icono">{abierto ? "−" : "+"}</span>
      </button>

      {abierto && (
        <div className="filtro__contenido">
          {opciones.length === 0 ? (
            <p className="filtro__vacio">{mensajeVacio}</p>
          ) : (
            opciones.map((opcion) => (
              <label className="filtro__opcion" key={opcion.id}>
                <input
                  type="checkbox"
                  checked={seleccionado === opcion.id}
                  onChange={() => onSeleccionar(opcion.id)}
                />
                <span className="filtro__check" />
                <span className="filtro__nombre">{opcion.nombre}</span>
                <span className="filtro__cantidad">{opcion.cantidad}</span>
              </label>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default function MaterialesPage() {
  const [ambitoId, setAmbitoId] = useState<number | null>(null);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [lineaId, setLineaId] = useState<number | null>(null);
  const [familiaId, setFamiliaId] = useState<number | null>(null);
  const [modeloId, setModeloId] = useState<number | null>(null);
  const [talla, setTalla] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [materiales, setMateriales] = useState<Material[]>(materialesMock);
  const [cargando, setCargando] = useState(false);
  const [ordenCampo, setOrdenCampo] = useState<OrdenCampo>("nombre");
  const [direccion, setDireccion] = useState<Direccion>("asc");

  const [abiertos, setAbiertos] = useState<Record<FiltroKey, boolean>>({
    ambito: true,
    categoria: false,
    linea: false,
    familia: false,
    modelo: false,
    talla: true,
  });

  const ambitoSeleccionado = ambitosMock.find((x) => x.id === ambitoId);
  const categoriaSeleccionada = categoriasMock.find((x) => x.id === categoriaId);
  const lineaSeleccionada = lineasMock.find((x) => x.id === lineaId);
  const familiaSeleccionada = familiasMock.find((x) => x.id === familiaId);
  const modeloSeleccionado = modelosMock.find((x) => x.id === modeloId);

  const categoriasDisponibles = useMemo(
    () => categoriasMock.filter((x) => ambitoId !== null && x.idAmbito === ambitoId),
    [ambitoId]
  );

  const lineasDisponibles = useMemo(
    () => lineasMock.filter((x) => categoriaId !== null && x.idCategoria === categoriaId),
    [categoriaId]
  );

  const familiasDisponibles = useMemo(
    () => familiasMock.filter((x) => lineaId !== null && x.idLinea === lineaId),
    [lineaId]
  );

  const modelosDisponibles = useMemo(
    () => modelosMock.filter((x) => familiaId !== null && x.idFamilia === familiaId),
    [familiaId]
  );

  const tallasDisponibles = useMemo(() => {
    const tallas = materialesMock
      .filter((m) => {
        if (ambitoSeleccionado && m.ambito !== ambitoSeleccionado.nombre) return false;
        if (categoriaSeleccionada && m.categoria !== categoriaSeleccionada.nombre) return false;
        if (lineaSeleccionada && m.linea !== lineaSeleccionada.nombre) return false;
        if (familiaSeleccionada && m.familia !== familiaSeleccionada.nombre) return false;
        if (modeloSeleccionado && m.modelo !== modeloSeleccionado.nombre) return false;
        return true;
      })
      .map((m) => m.lo)
      .filter(Boolean);

    return Array.from(new Set(tallas)).sort((a, b) => {
      const numeroA = Number(a);
      const numeroB = Number(b);

      if (!Number.isNaN(numeroA) && !Number.isNaN(numeroB)) {
        return numeroA - numeroB;
      }

      return a.localeCompare(b, "es", { numeric: true });
    });
  }, [
    ambitoSeleccionado,
    categoriaSeleccionada,
    lineaSeleccionada,
    familiaSeleccionada,
    modeloSeleccionado,
  ]);

  const opcionesAmbito: OpcionFiltro[] = ambitosMock.map((ambito) => ({
    ...ambito,
    cantidad: materialesMock.filter((m) => m.ambito === ambito.nombre).length,
  }));

  const opcionesCategoria: OpcionFiltro[] = categoriasDisponibles.map((categoria) => ({
    ...categoria,
    cantidad: materialesMock.filter(
      (m) =>
        m.ambito === ambitoSeleccionado?.nombre &&
        m.categoria === categoria.nombre
    ).length,
  }));

  const opcionesLinea: OpcionFiltro[] = lineasDisponibles.map((linea) => ({
    ...linea,
    cantidad: materialesMock.filter(
      (m) =>
        m.ambito === ambitoSeleccionado?.nombre &&
        m.categoria === categoriaSeleccionada?.nombre &&
        m.linea === linea.nombre
    ).length,
  }));

  const opcionesFamilia: OpcionFiltro[] = familiasDisponibles.map((familia) => ({
    ...familia,
    cantidad: materialesMock.filter(
      (m) =>
        m.ambito === ambitoSeleccionado?.nombre &&
        m.categoria === categoriaSeleccionada?.nombre &&
        m.linea === lineaSeleccionada?.nombre &&
        m.familia === familia.nombre
    ).length,
  }));

  const opcionesModelo: OpcionFiltro[] = modelosDisponibles.map((modelo) => ({
    ...modelo,
    cantidad: materialesMock.filter(
      (m) =>
        m.ambito === ambitoSeleccionado?.nombre &&
        m.categoria === categoriaSeleccionada?.nombre &&
        m.linea === lineaSeleccionada?.nombre &&
        m.familia === familiaSeleccionada?.nombre &&
        m.modelo === modelo.nombre
    ).length,
  }));


  useEffect(() => {
    let activo = true;

    const temporizador = window.setTimeout(async () => {
      setCargando(true);

      const resultado = await buscarMaterialesMock({
        ambito: ambitoSeleccionado?.nombre,
        categoria: categoriaSeleccionada?.nombre,
        linea: lineaSeleccionada?.nombre,
        familia: familiaSeleccionada?.nombre,
        modelo: modeloSeleccionado?.nombre,
        talla: talla ?? undefined,
        busqueda: busqueda.trim() || undefined,
      });

      if (activo) {
        setMateriales(resultado);
        setCargando(false);
      }
    }, 180);

    return () => {
      activo = false;
      window.clearTimeout(temporizador);
    };
  }, [
    ambitoSeleccionado?.nombre,
    categoriaSeleccionada?.nombre,
    lineaSeleccionada?.nombre,
    familiaSeleccionada?.nombre,
    modeloSeleccionado?.nombre,
    talla,
    busqueda,
  ]);

  const materialesOrdenados = useMemo(() => {
    return [...materiales].sort((a, b) => {
      let resultado = 0;

      if (ordenCampo === "nombre") {
        resultado = a.nombreMostrar.localeCompare(b.nombreMostrar, "es");
      } else if (ordenCampo === "codigo") {
        resultado = a.codigo.localeCompare(b.codigo, "es", { numeric: true });
      } else {
        resultado = a.stock - b.stock;
      }

      return direccion === "asc" ? resultado : -resultado;
    });
  }, [materiales, ordenCampo, direccion]);

  const toggleAcordeon = (key: FiltroKey) => {
    setAbiertos((actual) => ({ ...actual, [key]: !actual[key] }));
  };

  const seleccionarAmbito = (id: number) => {
    const nuevoId = ambitoId === id ? null : id;
    setAmbitoId(nuevoId);
    setCategoriaId(null);
    setLineaId(null);
    setFamiliaId(null);
    setModeloId(null);
    setTalla(null);

    if (nuevoId !== null) {
      setAbiertos((actual) => ({ ...actual, categoria: true }));
    }
  };

  const seleccionarCategoria = (id: number) => {
    const nuevoId = categoriaId === id ? null : id;
    setCategoriaId(nuevoId);
    setLineaId(null);
    setFamiliaId(null);
    setModeloId(null);
    setTalla(null);

    if (nuevoId !== null) {
      setAbiertos((actual) => ({ ...actual, linea: true }));
    }
  };

  const seleccionarLinea = (id: number) => {
    const nuevoId = lineaId === id ? null : id;
    setLineaId(nuevoId);
    setFamiliaId(null);
    setModeloId(null);
    setTalla(null);

    if (nuevoId !== null) {
      setAbiertos((actual) => ({ ...actual, familia: true }));
    }
  };

  const seleccionarFamilia = (id: number) => {
    const nuevoId = familiaId === id ? null : id;
    setFamiliaId(nuevoId);
    setModeloId(null);
    setTalla(null);

    if (nuevoId !== null) {
      setAbiertos((actual) => ({ ...actual, modelo: true }));
    }
  };

  const seleccionarModelo = (id: number) => {
    setModeloId((actual) => (actual === id ? null : id));
    setTalla(null);
  };

  const limpiarFiltros = () => {
    setAmbitoId(null);
    setCategoriaId(null);
    setLineaId(null);
    setFamiliaId(null);
    setModeloId(null);
    setTalla(null);
    setBusqueda("");
  };

  const hayFiltros =
    ambitoId !== null ||
    categoriaId !== null ||
    lineaId !== null ||
    familiaId !== null ||
    modeloId !== null ||
    talla !== null ||
    busqueda.trim() !== "";

  const generarMailto = () => {
    const destinatario = "datoscomerciales@plasticaucho.com";
    const copia = "helpdesk@plasticaucho.com";

    const asunto = "Solicitud de Pedido Gratuito";

    const cuerpo = `
Estimados,

Solicito la creación del siguiente pedido gratuito.

Motivo: DONACIÓN
Sector: COMERCIAL
Receptor: Juan Pérez
Lugar de entrega: Ambato

Materiales:

1000 - COLEGIAL CLASICO - Talla 28 - Cantidad: 2
1001 - COLEGIAL CLASICO - Talla 39 - Cantidad: 1

Saludos.
`;

    return (
      `mailto:${destinatario}` +
      `?cc=${encodeURIComponent(copia)}` +
      `&subject=${encodeURIComponent(asunto)}` +
      `&body=${encodeURIComponent(cuerpo)}`
    );
  };

  return (
    <main className="catalogo-page">
      <section className="catalogo-hero">
        <div>
          <span className="catalogo-hero__eyebrow">PEDIDOS GRATUITOS</span>
          <h1>Catálogo de materiales</h1>
          <p>Busca y filtra los materiales disponibles para tu solicitud.</p>
          <a
  href={generarMailto()}
  className="btn-generar-correo"
>
  Generar correo
</a>
        </div>

        <div className="catalogo-buscador">
          <span className="catalogo-buscador__icono">⌕</span>
          <input
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por código, material, modelo, color..."
          />
          {busqueda && (
            <button type="button" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda">
              ×
            </button>
          )}
        </div>
      </section>

      <div className="catalogo-layout">
        <aside className="catalogo-sidebar">
          <div className="catalogo-sidebar__titulo">
            <h2>Filtrar por</h2>
            {hayFiltros && (
              <button type="button" onClick={limpiarFiltros}>
                Limpiar
              </button>
            )}
          </div>

          <FiltroAcordeon
            titulo="Ámbito"
            abierto={abiertos.ambito}
            opciones={opcionesAmbito}
            seleccionado={ambitoId}
            onToggle={() => toggleAcordeon("ambito")}
            onSeleccionar={seleccionarAmbito}
          />

          <FiltroAcordeon
            titulo="Categoría"
            abierto={abiertos.categoria}
            opciones={opcionesCategoria}
            seleccionado={categoriaId}
            onToggle={() => toggleAcordeon("categoria")}
            onSeleccionar={seleccionarCategoria}
            mensajeVacio="Selecciona primero un ámbito"
          />

          <FiltroAcordeon
            titulo="Línea"
            abierto={abiertos.linea}
            opciones={opcionesLinea}
            seleccionado={lineaId}
            onToggle={() => toggleAcordeon("linea")}
            onSeleccionar={seleccionarLinea}
            mensajeVacio="Selecciona primero una categoría"
          />

          <FiltroAcordeon
            titulo="Familia"
            abierto={abiertos.familia}
            opciones={opcionesFamilia}
            seleccionado={familiaId}
            onToggle={() => toggleAcordeon("familia")}
            onSeleccionar={seleccionarFamilia}
            mensajeVacio="Selecciona primero una línea"
          />

          <FiltroAcordeon
            titulo="Modelo"
            abierto={abiertos.modelo}
            opciones={opcionesModelo}
            seleccionado={modeloId}
            onToggle={() => toggleAcordeon("modelo")}
            onSeleccionar={seleccionarModelo}
            mensajeVacio="Selecciona primero una familia"
          />

          <section className={`filtro ${abiertos.talla ? "filtro--abierto" : ""}`}>
            <button
              className="filtro__cabecera"
              type="button"
              onClick={() => toggleAcordeon("talla")}
            >
              <span>Talla</span>
              <span className="filtro__icono">{abiertos.talla ? "−" : "+"}</span>
            </button>

            {abiertos.talla && (
              <div className="filtro__contenido">
                {tallasDisponibles.length === 0 ? (
                  <p className="filtro__vacio">No hay tallas disponibles</p>
                ) : (
                  <div className="talla-grid">
                    {tallasDisponibles.map((valor) => (
                      <button
                        type="button"
                        key={valor}
                        className={`talla-boton ${talla === valor ? "talla-boton--activo" : ""}`}
                        onClick={() => setTalla((actual) => (actual === valor ? null : valor))}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </aside>

        <section className="catalogo-resultados">
          <div className="catalogo-toolbar">
            <div>
              <strong>{materialesOrdenados.length}</strong>
              <span> materiales encontrados</span>
            </div>

            <div className="catalogo-toolbar__orden">
              <select
                value={ordenCampo}
                onChange={(event) => setOrdenCampo(event.target.value as OrdenCampo)}
              >
                <option value="nombre">Nombre del material</option>
                <option value="codigo">Código SAP</option>
                <option value="stock">Stock</option>
              </select>

              <select
                value={direccion}
                onChange={(event) => setDireccion(event.target.value as Direccion)}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          {cargando ? (
            <div className="catalogo-estado">Buscando materiales...</div>
          ) : materialesOrdenados.length === 0 ? (
            <div className="catalogo-estado">
              <strong>No encontramos materiales</strong>
              <span>Prueba cambiando los filtros o el texto de búsqueda.</span>
            </div>
          ) : (
            <div className="material-grid">
              {materialesOrdenados.map((material) => (
                <article className="material-card" key={material.codigo}>
                  <div className="material-card__imagen">
                    <span className="material-card__estado">{material.estadoVenta || "S/E"}</span>
                    <div className="material-card__placeholder">
                      <span>{material.modelo}</span>
                      <small>Imagen del material</small>
                    </div>
                  </div>

                  <div className="material-card__body">
                    <div className="material-card__encabezado">
                      <span className="material-card__codigo">SAP {material.codigo}</span>
                      <span className="material-card__stock">Stock: {material.stock}</span>
                    </div>

                    <h3>{material.nombreMostrar}</h3>
                    <p>{material.textoMaterial}</p>

                    <div className="material-card__datos">
                      <div>
                        <span>Ámbito</span>
                        <strong>{material.ambito}</strong>
                      </div>
                      <div>
                        <span>Categoría</span>
                        <strong>{material.categoria}</strong>
                      </div>
                      <div>
                        <span>Familia</span>
                        <strong>{material.familia}</strong>
                      </div>
                      <div>
                        <span>Talla / U.M.</span>
                        <strong>{material.lo}</strong>
                      </div>
                      <div>
                        <span>Género</span>
                        <strong>{material.genero || "-"}</strong>
                      </div>
                      <div>
                        <span>Color</span>
                        <strong>{material.color || "-"}</strong>
                      </div>
                    </div>

                    <div className="material-card__pie">
                      <div>
                        <span>Precio 1</span>
                        <strong>${material.precio1.toFixed(2)}</strong>
                      </div>
                      <button type="button">Agregar</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
