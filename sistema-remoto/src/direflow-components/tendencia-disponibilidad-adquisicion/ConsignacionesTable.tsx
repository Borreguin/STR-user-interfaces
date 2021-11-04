import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import {
  to_yyyy_mm_dd_hh_mm_ss,
} from "../Common/DatePicker/DateRange";
import { CSVLink } from "react-csv";
import { SRM_API_URL } from "../../Constantes";

type consignacion = {
  no_consignacion: string;
  fecha_inicio: string;
  fecha_final: string;
  id_consignacion: string;
  responsable: string;
  detalle: string | undefined;
  descripcion_corta: string | undefined;
  entidad: string;
  elemento: string;
};

interface Props {
  ini_date: Date;
  end_date: Date;
}
interface States {
  loading: boolean;
  consignaciones: Array<consignacion>;
}

export class ConsignacionesTable extends Component<Props, States> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      loading: false,
      consignaciones: [],
    };
  }

  componentDidMount = () => {
    this.load_table_data();
  };

  componentDidUpdate = (prevProps) => {
    if (
      this.props.ini_date !== prevProps.ini_date ||
      this.props.end_date !== prevProps.end_date
    ) {
      this.load_table_data();
    }
  };

  load_table_data = () => {
    let path = `${SRM_API_URL}/admin-consignacion/consignaciones/json/${to_yyyy_mm_dd_hh_mm_ss(
      this.props.ini_date
    )}/${to_yyyy_mm_dd_hh_mm_ss(this.props.end_date)}`;
    this.setState({ loading: true });
    fetch(path)
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
        }
        this.setState({ consignaciones: consignaciones, loading: false });
      });
  };
  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };
    let columns = [
      {
        name: "ID consignación",
        //cell: (row) => <div>{row.no_consignacion }</div>,
        selector: "no_consignacion",
        sortable: true,
      },
      {
        name: "Entidad",
        selector: "entidad",
        sortable: true,
      },
      {
        name: "Elemento",
        selector: "elemento",
        sortable: true,
      },
      {
        name: "Inicio (y-m-d)",
        selector: "fecha_inicio",
        sortable: true,
      },
      {
        name: "Fin (y-m-d)",
        selector: "fecha_final",
        sortable: true,
      },
      {
        name: "Descripción",
        selector: "descripcion_corta",
        sortable: true,
      },
      {
        name: "Detalle",
        selector: "detalle",
        sortable: true,
      },
      {
        name: "Responsable",
        selector: "responsable",
        sortable: true,
      },
    ];

    return (
      <Card>
        <Card.Body>
          <Card.Title>
            Tabla de Consignaciones ingresadas en el sistema:
          </Card.Title>
          <DataTable
            pagination={true}
            columns={columns}
            data={this.state.consignaciones}
            fixedHeader
            noHeader={true}
            compact={true}
          />
          <Button
            variant="outline-dark"
        
          >
            <CSVLink
              data={this.state.consignaciones}
              filename={"Consignaciones.csv"}
            >
              Descargar CSV
            </CSVLink>
          </Button>
          <Button
            variant="outline-dark"
            target={"_blank"}
            href={`/api-sct/admin-consignacion/consignaciones/json/${to_yyyy_mm_dd_hh_mm_ss(
              this.props.ini_date
            )}/${to_yyyy_mm_dd_hh_mm_ss(this.props.end_date)}`}
          >
            JSON Info
          </Button>
        </Card.Body>
      </Card>
    );
  }
}
