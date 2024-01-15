import { v2Entity, v2Installation, v2Node } from "./V2GeneralTypes";

export const summarizeNode = (node: v2Node, includeIds: boolean = true) => {
  let resp = {};
  resp["tipo"] = node.tipo;
  resp["nombre"] = node.nombre;
  resp["n_entidades"] = node.n_entidades;
  resp["n_instalaciones"] = node.n_instalaciones;
  resp["n_bahias"] = node.n_bahias;
  resp["n_tags"] = node.n_tags;
  resp["activado"] = node.activado;
  resp["actualizado"] = node.actualizado;
  if (includeIds) {
    resp["id_node"] = node.id_node;
    resp["document_id"] = node.document_id;
  }
  return resp;
};

export const summarizeEntity = (
  entity: v2Entity,
  includeIds: boolean = true,
) => {
  let resp = {};
  resp["entidad_tipo"] = entity.entidad_tipo;
  resp["entidad_nombre"] = entity.entidad_nombre;
  resp["n_instalaciones"] = entity.instalaciones.length;
  resp["activado"] = entity.activado;
  if (includeIds) {
    resp["id_entidad"] = entity.id_entidad;
    resp["document_id"] = entity.document_id;
  }
  return resp;
};

export const summarizeInstallation = (
  installation: v2Installation,
  includeIds: boolean = true,
) => {
  let resp = {};
  resp["instalacion_tipo"] = installation.instalacion_tipo;
  resp["instalacion_nombre"] = installation.instalacion_nombre;
  resp["instalacion_ems_code"] = installation.instalacion_ems_code;
  resp["protocolo"] = installation.protocolo;
  resp["latitud"] = installation.latitud;
  resp["longitud"] = installation.longitud;
  resp["activado"] = installation.activado;
  if (includeIds) {
    resp["instalacion_id"] = installation.instalacion_id;
    resp["document_id"] = installation.document_id;
  }
  return resp;
};
