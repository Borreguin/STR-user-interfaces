import { SCT_API_URL, SRM_API_URL } from "../../../Constantes";

const handleResponse = (res: Response) => {
  if (res.status === 500) {
    return {
      success: false,
      msg: "Error no determinado: No es posible obtener información desde la API",
    };
  }
  return res.json();
};

export const fetchGETData = async (url: string): Promise<JSON> => {
  return await fetch(url)
    .then((res) => handleResponse(res))
    .then((json) => {
      return json;
    })
    .catch((e) => handleError(url, e));
};

export const fetchPOSTData = async (url: string, body: any): Promise<JSON> => {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => handleResponse(res))
    .then((json) => {
      return json;
    })
    .catch((e) => handleError(url, e));
};

export const fetchPUTData = async (url: string, body: any): Promise<JSON> => {
  return await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => handleResponse(res))
    .then((json) => {
      return json;
    })
    .catch((e) => handleError(url, e));
};

export const fetchDELETEData = async (url: string): Promise<any> => {
  return await fetch(url, {
    method: "DELETE",
  })
    .then((res) => handleResponse(res)) // or res.json()
    .then((json) => {
      return json;
    })
    .catch((e) => handleError(url, e));
};

const handleError = (url: string, e: any) => {
  if (url.includes(SRM_API_URL)) {
    return {
      success: false,
      msg: "No hay conexion con la API Sistema Remoto",
    };
  }
  if (url.includes(SCT_API_URL)) {
    return {
      success: false,
      msg: "No hay conexion con la API Sistema Central",
    };
  }
  console.log(e);
  return { success: false, msg: "No es posible obtener información" };
};
