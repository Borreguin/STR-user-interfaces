export type UTR = {
  id_utr: string;
  utr_nombre: string;
  utr_tipo: string;
  utr_code: string;
  activado: boolean;
  longitude: number;
  latitude: number;
  protocol?: string;
  tags?: Array<TAG>;
};

export type Entity = {
  id_entidad: string;
  entidad_nombre: string;
  entidad_tipo: string;
  n_tags: number;
  n_utrs: number;
  utrs: Array<UTR>;
  activado: boolean;
};

export type Node = {
  id_node: string;
  nombre: string;
  tipo: string;
  n_tags: number;
  actualizado: string;
  activado: boolean;
  entidades: Array<Entity>;
};

export type TAG = {
  tag_name: string;
  filter_expression: string;
  activado: boolean;
};

export type Selected = {
  entidad_tipo: string;
  entidad_nombre: string;
  utr_nombre?: string;
};

export type SelectedID = {
  nodo: string;
  entidad: string;
  utr?: string;
};

export type InstallationElement = {
  instalacion_tipo: string;
  instalacion_nombre: string;
  instalacion_ems_code: string;
  protocolo: string;
  latitud: number;
  longitud: number;
  activado: boolean;
  instalacion_id: string;
  document_id: string;
};

export type NodeElement = {
  tipo: string;
  nombre: string;
  n_entidades: number;
  n_instalaciones: number;
  n_bahias: number;
  n_tags: number;
  activado: boolean;
  actualizado: string;
};

export type EntityElement = {
  entidad_tipo: string;
  entidad_nombre: string;
  n_instalaciones: number;
  activado: boolean;
};

export type BahiaElement = {
  bahia_nombre: string;
  bahia_tipo: string;
  bahia_code: string;
  voltaje: number;
  activado: boolean;
};

export type Element = NodeElement &
  EntityElement &
  InstallationElement &
  BahiaElement;

export type ConsignmentDetail = {
  detalle: string;
  descripcion_corta: string;
  consignment_type: string;
  element: Element;
};

export type Consignment = {
  t_minutos: number;
  no_consignacion: string;
  fecha_inicio: string;
  fecha_final: string;
  id_consignacion: string;
  responsable: string;
  detalle: ConsignmentDetail;
};
