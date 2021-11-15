import { SRM_API_URL } from "../../../Constantes"
import { to_yyyy_mm_dd } from "../../Common/DatePicker/DateRange";

type range = {
    Array
}
type list_reports = {
    success: boolean,
    done_reports: Array<range>,
    missing_reports: Array<range>
}

// Chequeando los reportes diarios existentes en bases de datos:
export const check_reporte_diario = (ini_date, end_date) => {
    const path = `${SRM_API_URL}/admin-report/check/reporte/diario/${to_yyyy_mm_dd(ini_date)}/${to_yyyy_mm_dd(end_date)}`;
    /*fetch(path)
        .then((res) => res.json())
        .then((json) => {
            if (json.success) { }
        })
          .catch((e) => {
            this.setState({
              loading: true,
              log: "Problema de conexión con la API-RMT",
            });
            console.log(e);
          });*/
}