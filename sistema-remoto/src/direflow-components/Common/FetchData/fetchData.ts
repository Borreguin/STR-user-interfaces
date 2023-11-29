import { SCT_API_URL, SRM_API_URL } from "../../../Constantes";

export const fetchGETData = async (url: string): Promise<JSON> => {
  return await fetch(url)
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((e) => handleError(url, e));
};


export const fetchPOSTData = async (url: string, body: any): Promise<JSON> => {
  return await fetch(url,{
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
      .then((res) => res.json())
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
}