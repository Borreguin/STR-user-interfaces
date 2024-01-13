import {fetchDELETEData, fetchGETData, fetchPOSTData, fetchPUTData} from "./fetchData";
import {entityByIdUrl, installationApiUrl, nodeApiUrl} from "../FilterNodesV2/constants";
import {EntityResponse, InstallationResponse, NodeResponse} from "./model";
import {v2Installation} from "../V2GeneralTypes";

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
    const response = (await fetchGETData(
        entityByIdUrl + id,
    )) as unknown as EntityResponse;
    if (response.success) {
        return response;
    }
    return response;
};

export const createNewInstallation = async (
    entidad_id: string, v2Installation: v2Installation
): Promise<InstallationResponse> => {
    const response = (await fetchPOSTData(
        `${installationApiUrl}/entidad-id/${entidad_id}`, v2Installation
    )) as unknown as InstallationResponse;
    if (response.success) {
        return response;
    }
    return response;
};


export const editInstallation = async (
    installation_id: string, v2Installation: v2Installation
): Promise<InstallationResponse> => {
    const response = (await fetchPUTData(
        `${installationApiUrl}/installation-id/${installation_id}`, v2Installation
    )) as unknown as InstallationResponse;
    if (response.success) {
        return response;
    }
    return response;
};

export const deleteInstallation = async (
    entity_id,
    installation_id: string
): Promise<InstallationResponse> => {
    const response = (await fetchDELETEData(
        `${installationApiUrl}/entity-id/${entity_id}/installation-id/${installation_id}`
    )) as unknown as InstallationResponse;
    if (response.success) {
        return response;
    }
    return response;
};