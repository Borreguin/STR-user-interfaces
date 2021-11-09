export type consignacion = {
    no_consignacion: string;
    fecha_inicio: string;
    fecha_final: string;
    id_consignacion: string;
    responsable: string;
    detalle: string | undefined;
    descripcion_corta: string | undefined;
    entidad: string;
    elemento: string;
  };