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
  tag_name: string,
  filter_expression: string,
  activado: boolean
}

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
