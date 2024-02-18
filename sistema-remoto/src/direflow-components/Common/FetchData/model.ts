import { v2Bahia, v2Entity, v2Installation, v2Node } from "../V2GeneralTypes";
import {
  NodeReport,
  StatusReport,
} from "../../disponibilidad-reporte/Cards/SRReport/Report";

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

export type StatusReportResponse = {
  success: boolean;
  msg: string;
  report: StatusReport;
};

export type NodeReportResponse = {
  success: boolean;
  msg: string;
  report: NodeReport;
};

export type ReportStartResponse = {
  success: boolean;
  msg: string;
  report_id: string;
};
