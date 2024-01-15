import { v2Entity, v2Installation, v2Node } from "../V2GeneralTypes";

export type NodeResponse = {
  success: boolean;
  msg: string;
  nodos: Array<v2Node>;
};

export type EntityResponse = {
  success: boolean;
  msg: string;
  entidad: v2Entity;
};

export type InstallationResponse = {
  success: boolean;
  msg: string;
  entidad: v2Installation;
};

export type CreateConsignmentResponse = {
  success: boolean;
  msg: string;
};
