export type DateRange = {
  startDate: Date | string;
  endDate: Date | string;
};

export type v2Entity = {
  id_entidad: string;
  document_id: string;
  entidad_nombre: string;
  entidad_tipo: string;
  instalaciones: Array<v2Installation>;
  n_tags: number;
  activado: boolean;
};

export type v2Node = {
  _id: string;
  document_id: string;
  id_node: string;
  nombre: string;
  tipo: string;
  n_tags: number;
  n_entidades: number;
  n_instalaciones: number;
  n_bahias: number;
  actualizado: string;
  activado: boolean;
  entidades: Array<v2Entity>;
};

export type v2Bahia = {
  document_id?: string;
  bahia_code: string;
  voltaje: number;
  bahia_nombre: string;
  tags?: Array<v2TAG>;
  activado: boolean;
  created?: string;
};

export type v2Installation = {
  instalacion_id?: string;
  document_id?: string;
  instalacion_ems_code: string;
  instalacion_nombre: string;
  instalacion_tipo: string;
  activado: boolean;
  protocolo: string;
  longitud: number;
  latitud: number;
  bahias?: Array<v2Bahia>;
  actualizado?: string;
};

export type v2TAG = {
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

export type ConsignmentRequest = {
  no_consignacion: string;
  responsable: string;
  element_info: ElementInfo;
  fecha_inicio?: string;
  fecha_final?: string;
};

export type ElementInfo = {
  detalle: string;
  descripcion_corta: string;
  consignment_type: string;
  element: any;
};
