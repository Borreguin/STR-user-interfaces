import { v2Entity, v2Node } from "../V2GeneralTypes";

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
