import { fetchGETData } from "./fetchData";
import { entityByIdUrl, nodeApiUrl } from "../FilterNodesV2/constants";
import { EntityResponse, NodeResponse } from "./model";

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
