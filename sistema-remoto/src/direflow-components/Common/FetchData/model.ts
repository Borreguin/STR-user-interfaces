import { v2Bahia, v2Entity, v2Installation, v2Node } from "../V2GeneralTypes";

export type SimpleResponse = {
  success: boolean;
  msg: string;
};

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

export type BahiaResponse = {
  success: boolean;
  msg: string;
  entidad: v2Bahia;
};

export type CreateConsignmentResponse = {
  success: boolean;
  msg: string;
};
