import { SCT_API_URL, SRM_API_URL } from "../../Constantes";
import {
  to_yyyy_mm_dd,
  to_yyyy_mm_dd_hh_mm_ss,
} from "../Common/DatePicker/DateRange";
import { consignacion } from "./types";

/**
 * Servico para crear la tendencia de disponibilidad diaria de información
 * @param ini_date: fecha de inicio
 * @param end_date: fecha de fin
 * @returns success: boolean, values: Array<date, Disp. diaria adquisición Datos>, msg: string
 */

export const service_daily_dispo_trend = async (
  ini_date: Date,
  end_date: Date
) => {
  let resp = { values: [], success: false, msg: "Loading... " };
  let path = `${SRM_API_URL}/sRemoto/tendencia/diaria/json/${to_yyyy_mm_dd(
    ini_date
  )}/${to_yyyy_mm_dd(end_date)}`;
  await fetch(path)
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        var result = [];
        for (const idx in json.result.dates) {
          result.push({
            date: json.result.dates[idx],
            "Disp. diaria adquisición Datos":
              json.result.values[idx] === null
                ? json.result.values[idx]
                : json.result.values[idx].toFixed(3),
          });
        }
        resp.values = result;
      }
      resp.msg = json.msg;
      resp.success = json.success;
    })
    .catch((e) => {
      console.log(e);
      resp.msg = e;
      return resp;
    });
  return resp;
};


/**
 * Servico para crear la tendencia de disponibilidad diaria de información
 * @param ini_date: fecha de inicio
 * @param end_date: fecha de fin
 * @returns success: boolean, values: Array<date, Disp. diaria adquisición Datos>, msg: string
 */

 export const service_monthly_control_disp_trend = async (
    ini_date: Date,
    end_date: Date
  ) => {
   let resp = { values: null, success: false, msg: "Loading... " };
   
    let path = `${SCT_API_URL}/reports/centro-control/tendencia/mensual/${to_yyyy_mm_dd(
      ini_date
    )}/${to_yyyy_mm_dd(end_date)}`;
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          var result = [];
          for (const idx in json.result.dates) {
            result.push({
              date: json.result.dates[idx],
              "Disp. mensual centro control":
                json.result.values[idx] === null
                  ? json.result.values[idx]
                  : json.result.values[idx].toFixed(3),
            });
          }
          resp.values = result;
        }
        resp.msg = json.msg;
        resp.success = json.success;
      })
      .catch((e) => {
        console.log(e);
        resp.msg = e;
        return resp;
      });
    return resp;
  };


/**
 * Consulta la tabla de consignaciones existentes
 * @param ini_date: fecha de inicio 
 * @param end_date: fecha de fin 
 * @returns lista de consignaciones
 */

export const service_consignaciones_table = async (
  ini_date: Date,
  end_date: Date
) => {
  let path = `${SCT_API_URL}/admin-consignacion/consignaciones/json/${to_yyyy_mm_dd_hh_mm_ss(
    ini_date
  )}/${to_yyyy_mm_dd_hh_mm_ss(end_date)}`;
  let resp = { consignaciones: [], success: false, msg: "Loading... " };
  await fetch(path)
    .then((res) => res.json())
    .then((json) => {
      let consignaciones = [] as Array<consignacion>;
      if (json.success) {
        for (let consigna of json.consignaciones) {
          let consg = {
            no_consignacion: consigna["no_consignacion"],
            fecha_inicio: consigna["fecha_inicio"],
            fecha_final: consigna["fecha_final"],
            id_consignacion: consigna["id_consignacion"],
            responsable: consigna["responsable"],
            detalle: consigna["detalle"],
            descripcion_corta: consigna["descripcion_corta"],
            entidad: consigna["entidad"],
            elemento: consigna["elemento"],
          } as consignacion;
          consignaciones.push(consg);
        }
        resp.success = json.success;
        resp.consignaciones = consignaciones;
      }
    })
    .catch((e) => {
      console.log(e);
      resp.msg = e;
      return resp;
    });
  return resp;
};
