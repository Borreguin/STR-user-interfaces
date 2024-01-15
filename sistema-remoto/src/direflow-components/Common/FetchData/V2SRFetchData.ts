import {
  fetchDELETEData,
  fetchGETData,
  fetchPOSTData,
  fetchPUTData,
} from "./fetchData";
import {
  consignmentApiUrl,
  entityByIdUrl,
  installationApiUrl,
  nodeApiUrl,
} from "../FilterNodesV2/constants";
import {
  CreateConsignmentResponse,
  EntityResponse,
  InstallationResponse,
  NodeResponse,
} from "./model";
import { v2Installation } from "../V2GeneralTypes";

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
): Promise<InstallationResponse> => {
  return (await fetchDELETEData(
    `${installationApiUrl}/entity-id/${entity_id}/installation-id/${installation_id}`,
  )) as unknown as InstallationResponse;
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
