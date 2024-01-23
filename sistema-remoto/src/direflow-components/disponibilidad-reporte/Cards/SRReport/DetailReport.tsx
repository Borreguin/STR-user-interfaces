import React, { Component } from "react";
import "./style.css";
import {
  reporte_nodo,
  reporte_entidad,
  reporte_utr,
  tag_details,
  reporte_instalacion,
} from "./Report";
import { Card, Badge, CardGroup, Modal, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { Circle, Line } from "rc-progress";
import DataTable from "react-data-table-component";
import { documentVersion } from "../../../Common/CommonConstants";
import { SmallCard } from "./SmallCard";

type DetReportProps = {
  report: reporte_nodo;
  document: string;
};

type DetReportState = {
  show: boolean; //For Modal
  utr: reporte_utr;
  search: string;
  filter_tags: Array<tag_details>;
  open: object;
};

let columns = [
  {
    name: "Nombre de tag",
    selector: "tag_name",
    sortable: true,
  },
  {
    name: "Indisponibilidad (minutos)",
    selector: "indisponible_minutos",
    sortable: true,
  },
];

class DetailReport extends Component<DetReportProps, DetReportState> {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      utr: undefined,
      search: "",
      filter_tags: [],
      open: {},
    };
    console.log("------> to work with: ", this.props.report);
  }

  _tooltip = (p: number, t: number) => {
    return (
      "<div>Ponderación: " +
      this._format_percentage(p, 2) +
      "%</div>" +
      "<div>Tags: " +
      t +
      "</div>"
    );
  };

  _open_close = (entidad_nombre) => {
    let open = this.state.open;
    if (open[entidad_nombre] === undefined) {
      open[entidad_nombre] = true;
    } else {
      open[entidad_nombre] = !open[entidad_nombre];
    }
    this.setState({ open: open });
  };

  _render_utr_report = (utr: reporte_utr, ix: number) => {
    return (
      <div id={ix + utr.id_utr} key={ix} className={"small-card-container"}>
        <SmallCard
          ponderacion={utr.ponderacion}
          tipo={utr.tipo}
          nombre={utr.nombre}
          n_tags={utr.numero_tags}
          n_bahias={undefined}
          n_consignaciones={utr.consignaciones.length}
          disponibilidad={utr.disponibilidad_promedio_porcentage}
          onNameShowModal={() => this._handleShow(utr)}
        />
      </div>
    );
  };

  _render_installation_report = (
    installation: reporte_instalacion,
    ix: number,
  ) => {
    return (
      <div
        id={ix + installation.id_utr}
        key={ix}
        className={"s-card-installation-container"}
      >
        <SmallCard
          ponderacion={installation.ponderacion}
          tipo={installation.tipo}
          nombre={installation.nombre}
          n_tags={installation.numero_tags}
          n_bahias={installation.numero_bahias}
          n_consignaciones={installation.consignaciones.length}
          disponibilidad={installation.disponibilidad_promedio_porcentage}
          onNameShowModal={() => this._handleShow(installation)}
        />
      </div>
    );
  };

  _render_entity_report = (entity: reporte_entidad) => {
    return (
      <Card key={entity.entidad_nombre} className="dr-container" border="dark">
        <Card.Header
          className={"dr-entity-header"}
          onClick={() => this._open_close(entity.entidad_nombre)}
        >
          <span>
            <Circle
              strokeWidth={15}
              className="dr-ponderacion"
              percent={entity.ponderacion * 100}
              strokeColor="#2db7f5"
              trailColor="gray"
              trailWidth={15}
            />
          </span>
          <span className="dr-entity-type">{entity.entidad_tipo}:</span>{" "}
          <span
            className="dr-entity-name"
            data-tip={this._tooltip(
              entity.ponderacion * 100,
              entity.numero_tags,
            )}
            data-html={true}
          >
            {entity.entidad_nombre}
          </span>
          <ReactTooltip />
          <span className="dr-entity-disp">
            {this._format_percentage(
              entity.disponibilidad_promedio_ponderada_porcentage,
              3,
            ) + " %"}
          </span>
        </Card.Header>
        <CardGroup
          className={
            this.state.open[entity.entidad_nombre] !== undefined &&
            this.state.open[entity.entidad_nombre]
              ? "dr-utr-group "
              : "dr-utr-group collapse"
          }
        >
          <>
            {this.props.document !== documentVersion.finalReportV2
              ? entity.reportes_utrs
                  .sort((b, a) => a.ponderacion - b.ponderacion)
                  .map((utr, ix) => this._render_utr_report(utr, ix))
              : entity.reportes_instalaciones
                  .sort((b, a) => a.ponderacion - b.ponderacion)
                  .map((installation, ix) =>
                    this._render_installation_report(installation, ix),
                  )}
          </>
        </CardGroup>
      </Card>
    );
  };
  _format_percentage = (percentage: number, n: number) => {
    if (percentage === 100) {
      return "100";
    } else if (percentage < 0) {
      return "---";
    } else {
      return "" + percentage.toFixed(n);
    }
  };

  _handleClose = () => {
    this.setState({ show: false });
  };
  _handleShow = (utr: reporte_utr) => {
    this.setState({ show: true, utr: utr, filter_tags: utr.tag_details });
  };

  _filter_tags = (e) => {
    let to_filter = e.target.value.toLowerCase();
    let filter_tags = [];
    this.state.utr.tag_details.forEach((tag) => {
      if (tag.tag_name.toLowerCase().includes(to_filter)) {
        filter_tags.push(tag);
      }
    });
    this.setState({ filter_tags: filter_tags });
  };

  render() {
    return (
      <>
        <CardGroup key={this.props.report.id_report}>
          {this.props.report.reportes_entidades === undefined ? (
            <></>
          ) : (
            this.props.report.reportes_entidades.map((entity) =>
              this._render_entity_report(entity),
            )
          )}
        </CardGroup>
        {this.state.utr === undefined ? (
          <></>
        ) : (
          <Modal
            show={this.state.show}
            onHide={this._handleClose}
            animation={false}
            size="lg"
          >
            <Modal.Header translate closeButton>
              <Modal.Title>
                {this.state.utr.tipo}: {this.state.utr.nombre}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                type="text"
                onChange={this._filter_tags}
                placeholder="Tag a buscar"
              />
              <DataTable
                pagination={true}
                columns={columns}
                data={this.state.filter_tags}
                noHeader={true}
              />
            </Modal.Body>
          </Modal>
        )}
      </>
    );
  }
}

export default DetailReport;
