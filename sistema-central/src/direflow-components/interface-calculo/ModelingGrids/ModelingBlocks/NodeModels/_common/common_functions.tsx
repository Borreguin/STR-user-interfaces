import { PortModel } from "@projectstorm/react-diagrams";
import { SCT_API_URL } from "../../../../../../Constantes";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../../../../modelamiento-componentes/common_functions";
import { get_fisrt_dates_of_last_month } from "../../../../common_functions";
export const canLinkToInportPort = (port: PortModel) => {
  // Esta función comprueba si se puede realizar las conexiones:
  // 1. Input -> SERIE
  // 2. Input -> PARALELO
  // 3. Input -> ROOT (conexión con root)
  // 4. Input -> PROMEDIO (conexión para operación: promedio)
  // 5. Input -> PONDERADO (conexión para operación: ponderado)
  const isSerialOutPort = port.getType() === "SERIE";
  const isParallelOutPort = port.getType() === "PARALELO";
  const isOutPut = port.getType() === "ROOT";
  const isAverageOutPut = port.getType() === "PROMEDIO";
  const isWeightedOutPut = port.getType() === "PONDERADO";
  const isFreeConnect = Object.keys(port.links).length === 0;
  const connect =
    isFreeConnect &&
    (isSerialOutPort ||
      isParallelOutPort ||
      isOutPut ||
      isAverageOutPut ||
      isWeightedOutPut);

  return connect;
};

// obtener puerto serie:
export const common_get_serie_port = (ports) => {
  for (var id_port in ports) {
    if (ports[id_port].getType() === "SERIE") {
      return ports[id_port];
    }
  }
  return null;
};

// get node connected in SERIE port:
export const common_get_node_connected_serie = (ports) => {
  let port = common_get_serie_port(ports);
  if (port === null) {
    return null;
  }
  let links = port.links;
  // busancdo los nodos conectados de manera paralela
  for (let id_link in links) {
    if (links[id_link].getSourcePort().getType() !== "SERIE") {
      return links[id_link].getSourcePort().getNode();
    } else {
      return links[id_link].getTargetPort().getNode();
    }
  }
  return null;
};

export const update_leaf_position = async(
  parent_id: string,
  public_id: string,
  pos_x: number,
  pos_y: number
) => {
  let result = {success:false, msg:"Enviando petición de cambio de posición"}
  let path = `${SCT_API_URL}/block-leaf/block-root/${parent_id}/block-leaf/${public_id}/position`;
  let body = { pos_x: pos_x, pos_y: pos_y };
  await fetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((json) => {
      result = json;
    })
    .catch(console.log);
  return result
};

export const update_leaf_topology = async (
  parent_id: string,
  public_id: string,
  topology
) => {
  let resp = { success: false, msg: "No hay topología a guardar" };
  let ans = null;
  if (!topology) {
    return resp;
  }
  let path = `${SCT_API_URL}/block-leaf/block-root/${parent_id}/block-leaf/${public_id}/topology`;
  let body = { topology: topology };
  await fetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => {
      ans = resp;
      return res.json();
    })
    .then((json) => {
      console.log("topology", json);
      resp = json;
    })
    .catch((e) => {
      console.log(e);
      console.log(ans);
    });
  return resp;
};

export const get_range = () => {
  let ini_period_str = localStorage.getItem("$ini_period");
  let ini_period = new Date(ini_period_str);
  let end_period_str = localStorage.getItem("$end_period");
  let end_period = new Date(end_period_str);
  let period = null;

  if (ini_period_str === null || end_period_str === null) {
    period = get_fisrt_dates_of_last_month();
  } else {
    period = {first_day_month: ini_period, last_day_month: end_period}
  }
  return `${to_yyyy_mm_dd_hh_mm_ss(period.first_day_month)}/${to_yyyy_mm_dd_hh_mm_ss(period.last_day_month)}`;
}

export const get_reporte_parcial = async (parent_id:string, public_id:string) => {
  let path = `${SCT_API_URL}/calculation/reporte-parcial/${parent_id}/${public_id}/${get_range()}`
  let reporte_parcial = null;
  await fetch(path, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      if (json.success) {
        reporte_parcial = json.reporte_parcial;
      }
    })
    .catch(console.log);
  return reporte_parcial;
}
