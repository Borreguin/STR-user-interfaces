import {
  fetchDELETEData,
  fetchGETData,
  fetchPOSTData,
  fetchPUTData,
} from "./fetchData";
import {
  bahiaApiUrl,
  consignmentApiUrl,
  entityByIdUrl,
  installationApiUrl,
  nodeApiUrl,
  statusReportApiUrl,
} from "../FilterNodesV2/constants";
import {
  BahiaResponse,
  CreateConsignmentResponse,
  EntityResponse,
  InstallationResponse,
  NodeResponse,
  SimpleResponse,
  StatusReportResponse,
} from "./model";
import { v2Bahia, v2Installation } from "../V2GeneralTypes";

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

export const getStatusReport = async (report_id: string): Promise<any> => {
  return (await fetchGETData(
    `${statusReportApiUrl}${report_id}`,
  )) as unknown as StatusReportResponse;
};
