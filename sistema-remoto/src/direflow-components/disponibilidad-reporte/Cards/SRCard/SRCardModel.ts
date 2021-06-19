import * as _ from "lodash";

export type UTR = {
  id_utr: string;
  utr_nombre: string;
  utr_tipo: string;
  utr_code: string;
  activado: boolean;
  longitude: number;
  latitude: number;
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

export function new_node() {
  let node = {
    id_node: _.uniqueId("new_node"),
    nombre: "Ingrese nombre ",
    tipo: "Empresa",
    n_tags: 0,
    actualizado: "",
    activado: true,
    entidades: [],
  };
  return node;
}

export function new_entity() {
  return {
    id_entidad: _.uniqueId("new_entity"),
    entidad_nombre: "Ingrese nombre",
    entidad_tipo: "Nueva entidad",
    n_tags: 0,
    n_utrs: 0,
    utrs: [],
    activado: false,
  };
}
