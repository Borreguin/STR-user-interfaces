import {
  fetchDELETEData,
  fetchGETData,
  fetchPOSTData,
  fetchPUTData,
} from "./fetchData";
import {
  bahiaApiUrl,
  consignmentApiUrl,
  detailedNodeReportApiUrl,
  detailedNodeReportByIdApiUrl,
  entityByIdUrl,
  installationApiUrl,
  nodeApiUrl,
  overviewReportApiUrl,
  searchTagsApiUrl,
  statusReportApiUrl,
  tagValuesApiUrl,
} from "../FilterNodesV2/constants";
import {
  BahiaResponse,
  CreateConsignmentResponse,
  EntityResponse,
  InstallationResponse,
  NodeReportResponse,
  NodeResponse,
  ReportStartResponse,
  SimpleResponse,
  StatusReportResponse,
  TagValuesResponse,
} from "./model";
import { v2Bahia, v2Installation } from "../V2GeneralTypes";
import { ConsignmentRequest, TAG } from "../GeneralTypes";
import { IdsRequest } from "./requestModel";

export const getAllNodeInfo = async (): Promise<NodeResponse> => {
  const response = (await fetchGETData(nodeApiUrl)) as unknown as NodeResponse;
  if (response.success) {
    return response;
  }
  response.nodos = [];
  return response;
};

export const getEntityInfoById = async (
  id: string,
): Promise<EntityResponse> => {
  return (await fetchGETData(entityByIdUrl + id)) as unknown as EntityResponse;
};

export const createNewInstallation = async (
  entidad_id: string,
  v2Installation: v2Installation,
): Promise<InstallationResponse> => {
  return (await fetchPOSTData(
    `${installationApiUrl}/entidad-id/${entidad_id}`,
    v2Installation,
  )) as unknown as InstallationResponse;
};

export const editInstallation = async (
  installation_id: string,
  v2Installation: v2Installation,
): Promise<InstallationResponse> => {
  return (await fetchPUTData(
    `${installationApiUrl}/installation-id/${installation_id}`,
    v2Installation,
  )) as unknown as InstallationResponse;
};

export const deleteInstallation = async (
  entity_id: string,
  installation_id: string,
): Promise<SimpleResponse> => {
  return (await fetchDELETEData(
    `${installationApiUrl}/entity-id/${entity_id}/installation-id/${installation_id}`,
  )) as unknown as SimpleResponse;
};

export const insertConsignment = async (
  element_id: string,
  ini_date: string,
  end_date: string,
  consignment: any,
): Promise<CreateConsignmentResponse> => {
  return (await fetchPOSTData(
    `${consignmentApiUrl}/${element_id}/${ini_date}/${end_date}`,
    consignment,
  )) as unknown as CreateConsignmentResponse;
};

export const createNewBahia = async (
  installation_id: string,
  v2Bahia: v2Bahia,
): Promise<BahiaResponse> => {
  return (await fetchPOSTData(
    `${bahiaApiUrl}/${installation_id}`,
    v2Bahia,
  )) as unknown as BahiaResponse;
};

export const editBahia = async (
  installation_id: string,
  document_id: string,
  v2Bahia: v2Bahia,
): Promise<BahiaResponse> => {
  return (await fetchPUTData(
    `${bahiaApiUrl}/${installation_id}/bahia/${document_id}`,
    v2Bahia,
  )) as unknown as BahiaResponse;
};

export const deleteBahia = async (
  installation_id: string,
  document_id: string,
): Promise<BahiaResponse> => {
  return (await fetchDELETEData(
    `${bahiaApiUrl}/${installation_id}/bahia/${document_id}`,
  )) as unknown as BahiaResponse;
};

export const getStatusReport = async (
  report_id: string,
): Promise<StatusReportResponse> => {
  return (await fetchGETData(
    `${statusReportApiUrl}${report_id}`,
  )) as unknown as StatusReportResponse;
};

export const getDetailedNodeReport = async (
  tipo: string,
  nombre: string,
  range: string,
): Promise<any> => {
  return (await fetchGETData(
    `${detailedNodeReportApiUrl}/${tipo}/${nombre}/${range}`,
  )) as unknown as any;
};

export const getDetailedNodeReportById = async (
  report_id: string,
): Promise<NodeReportResponse> => {
  return (await fetchGETData(
    `${detailedNodeReportByIdApiUrl}${report_id}`,
  )) as unknown as NodeReportResponse;
};

export const getConsignmentsByIdAndRange = async (
  element_id: string,
  ini_date: string,
  end_date: string,
): Promise<any> => {
  return (await fetchGETData(
    `${consignmentApiUrl}/${element_id}/${ini_date}/${end_date}`,
  )) as unknown as any;
};

export const deleteConsignment = async (
  element_id: string,
  consignment_id: string,
): Promise<any> => {
  return (await fetchDELETEData(
    `${consignmentApiUrl}/${element_id}/${consignment_id}`,
  )) as unknown as any;
};

export const editConsignment = async (
  element_id: string,
  consignment_id: string,
  consignment: ConsignmentRequest,
): Promise<any> => {
  return (await fetchPUTData(
    `${consignmentApiUrl}/${element_id}/${consignment_id}`,
    consignment,
  )) as unknown as any;
};

export const overwriteNodeReport = async (
  range: string,
  idsRequest: IdsRequest,
): Promise<ReportStartResponse> => {
  return (await fetchPUTData(
    `${overviewReportApiUrl}${range}`,
    idsRequest,
  )) as unknown as ReportStartResponse;
};

export const deleteNodeReport = async (
  range: string,
  idsRequest: IdsRequest,
): Promise<ReportStartResponse> => {
  return (await fetchDELETEData(
    `${overviewReportApiUrl}${range}`,
    idsRequest,
  )) as unknown as ReportStartResponse;
};

export const getTagValues = async (
  tagList: Array<TAG>,
): Promise<TagValuesResponse> => {
  return (await fetchPOSTData(tagValuesApiUrl, {
    tags: tagList,
  })) as unknown as TagValuesResponse;
};

export const searchTags = async (
  search: string,
  regex: string,
): Promise<TagValuesResponse> => {
  const uri = `${searchTagsApiUrl}/${search}`;
  return (await fetchPOSTData(uri, {
    regex,
  })) as unknown as TagValuesResponse;
};
