import React, { Component } from "react";
import "./style.css";
import {
  reporte_nodo,
  reporte_entidad,
  reporte_utr,
  tag_details,
} from "./Report";
import { Card, Badge, CardGroup, Modal, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { Circle, Line } from "rc-progress";
import DataTable from "react-data-table-component";

type DetReportProps = {
  report: reporte_nodo;
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

  _render_utr_report = (utr: reporte_utr) => {
    return (
      <Card.Body
        className="dr-utr-body"
        key={utr.id_utr}
      >
        <div className="dr-utr-description">
          <Line className="dr-utr-bar" percent={utr.ponderacion * 100} />
          <div>{utr.tipo}</div>
          <div
            className="dr-utr-label"
            data-tip={this._tooltip(utr.ponderacion * 100, utr.numero_tags)}
            data-html={true}
            onClick={() => this._handleShow(utr)}
          >
            {utr.nombre}
          </div>
        </div>
        <div className="dr-utr-disp">
          {this._format_percentage(utr.disponibilidad_promedio_porcentage, 2)} %
        </div>
        <div className="dr-utr-disp">
          <Badge variant="info">{utr.consignaciones.length} Consg.</Badge>
        </div>
        <ReactTooltip />
      </Card.Body>
    );
  };

  _render_entity_report = (entity: reporte_entidad) => {
    return (
      <Card key={entity.entidad_nombre} className="dr-container" border="dark">
        <Card.Header className="dr-entity-header"
          onClick={() => this._open_close(entity.entidad_nombre)}>
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
              entity.numero_tags
            )}
            data-html={true}
          >
            {entity.entidad_nombre}
          </span>
          <ReactTooltip />
          <span className="dr-entity-disp">
            {this._format_percentage(
              entity.disponibilidad_promedio_ponderada_porcentage,
              3
            ) + " %"}
          </span>
        </Card.Header>
        <CardGroup
          className={
            this.state.open[entity.entidad_nombre] !== undefined &&
            this.state.open[entity.entidad_nombre]
              ? " dr-utr-group "
              : " dr-utr-group collapse"
          }
        >
          {entity.reportes_utrs.map((utr) => this._render_utr_report(utr))}
        </CardGroup>
      </Card>
    );
  };
  _format_percentage = (percentage: number, n: number) => {
    if (percentage === 100) {
      return "100";
    } else if ( percentage < 0) { 
      return "---";
    }
    else {
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
        <CardGroup>
          {this.props.report.reportes_entidades === undefined ? (
            <></>
          ) : (
            this.props.report.reportes_entidades.map((entity) =>
              this._render_entity_report(entity)
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
