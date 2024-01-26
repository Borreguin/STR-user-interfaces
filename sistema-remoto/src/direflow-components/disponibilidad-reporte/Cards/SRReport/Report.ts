import { Consignment } from "../../../Common/GeneralTypes";

export type Report = {
  disponibilidad_promedio_ponderada_porcentage: number;
  disponibilidad_promedio_porcentage: number;
  fecha_final: string;
  fecha_inicio: string;
  id_report: string;
  novedades: Novedades;
  periodo_evaluacion_minutos: number;
  procesamiento: Procesamiento;
  reportes_nodos: Array<SummaryReport>;
  tiempo_calculo_segundos: number;
  actualizado: string;
  tipo: string;
  documento?: string;
};

export type Novedades = {
  tags_fallidas: number;
  entidades_fallidas: number;
  nodos_fallidos: number;
  utr_fallidas?: number; // for version 1
  instalaciones_fallidas: number; // for version 2
  bahias_fallidas: number; // for version 2
};

export type NovedadesDetalle = {
  tags_fallidas: Array<string>;
  utr_fallidas: Array<string>;
  entidades_fallidas: Array<string>;
};

export type Procesamiento = {
  numero_tags_total: number;
  numero_utrs_procesadas: number;
  numero_entidades_procesadas: number;
  numero_nodos_procesados?: number;
  numero_tags_procesadas?: number; // for version 2
  numero_instalaciones_procesadas?: number; // for version 2
  numero_bahias_procesadas?: number; // for version 2
  numero_tags?: number; // for version 2
};

export type SummaryReport = {
  id_report: string;
  actualizado: string;
  nombre: string;
  tipo: string;
  novedades: NovedadesDetalle;
  procesamiento: Procesamiento;
  disponibilidad_promedio_ponderada_porcentage: number;
  tiempo_calculo_segundos: number;
};

export type StatusReport = {
  id_report: string;
  percentage: number;
  created: string;
  modified: string;
  processing: boolean;
  fail: boolean;
  finish: boolean;
  info: info;
  msg: string;
};

export type info = {
  nombre?: string;
  tipo?: string;
  run_time_seconds?: number;
};

export type NodeReport = {
  id_node: string;
  id_report: string;
  tipo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_final: string;
  actualizado: string;
  tiempo_calculo_segundos: number;
  periodo_evaluacion_minutos: number;
  disponibilidad_promedio_ponderada_porcentage: number;
  tags_fallidas: Array<string>;
  utr_fallidas: Array<string>;
  entidades_fallidas: Array<string>;
  ponderacion: number;
  numero_tags_total: number;
  reportes_entidades: Array<EntityReport>;
};

export type EntityReport = {
  reportes_instalaciones: Array<InstallationReport>;
  entidad_nombre: string;
  entidad_tipo: string;
  numero_tags: number;
  reportes_utrs: Array<reporte_utr>;
  disponibilidad_promedio_ponderada_porcentage: number;
  disponibilidad_promedio_ponderada_minutos: number;
  periodo_evaluacion_minutos: number;
  ponderacion: number;
  document_id?: string; // for version 2
};

export type reporte_utr = {
  id_utr: string;
  nombre: string;
  tipo: string;
  tag_details: Array<tag_details>;
  numero_tags: number;
  indisponibilidad_acumulada_minutos: number;
  consignaciones: Array<any>;
  consignaciones_acumuladas_minutos: number;
  disponibilidad_promedio_porcentage: number;
  ponderacion: number;
};

export type InstallationReport = {
  consignaciones_internas: Array<Consignment>;
  periodo_efectivo_minutos: number;
  numero_consignaciones_internas: number;
  document_id: string;
  instalacion_id: string;
  nombre: string;
  tipo: string;
  tag_details: Array<tag_details>;
  numero_tags: number;
  indisponibilidad_acumulada_minutos: number;
  consignaciones_acumuladas_minutos: number;
  indisponibilidad_promedio_minutos: number;
  disponibilidad_promedio_porcentage: number;
  ponderacion: number;
  consignaciones: Array<Consignment>;
  numero_bahias: number;
  numero_tags_procesadas: number;
  bahia_details: Array<any>;
  periodo_evaluacion_minutos: number;
  nota: string;
};

export type tag_details = {
  tag_name: string;
  indisponible_minutos: number;
};

export type BahiaReport = {
  periodo_efectivo_minutos: number;
  numero_tags_procesadas: number;
  bahia_code: string;
  bahia_nombre: string;
  voltaje: number;
  tags: Array<tag_details>;
  numero_tags: number;
  indisponibilidad_acumulada_minutos: number;
  consignaciones_acumuladas_minutos: number;
  indisponibilidad_promedio_minutos: number;
  disponibilidad_promedio_porcentage: number;
  ponderacion: number;
  consignaciones: Array<any>;
  periodo_evaluacion_minutos: number;
  nota: string;
};
