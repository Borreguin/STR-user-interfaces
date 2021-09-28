import React, { Component } from "react";
import { Form, Col, Card, Row } from "react-bootstrap";
import { DateRangeTime } from "../Common/DatePicker/DateRangeTime";
import FilterSTRNodes from "../Common/FilterNodes/FilterSTRNodes";

export type Forma = {
  no_consignacion: String;
  fecha_inicio: Date;
  fecha_final: Date;
  detalle: String;
  selected: Object | undefined;
  selected_id: Object | undefined;
  descripcion_corta: string;
  responsable: string;
};

export interface SRConsigProps {
  onChange: Function;
}

export interface SRConsigState {
  forma: Forma;
}

class DatosMantenimiento extends Component<SRConsigProps, SRConsigState> {
  constructor(props) {
    super(props);
    this.state = {
      forma: {
        no_consignacion: undefined,
        selected: undefined,
        selected_id: undefined,
        fecha_inicio: new Date(),
        fecha_final: new Date(),
        detalle: "",
        descripcion_corta: "",
        responsable:
          localStorage.getItem("userRole") +
          " | " +
          localStorage.getItem("userDisplayName"),
      },
    };
  }

  // permite manejar cambios en el filtrado de nodos
  _handle_filter_STRNodes = (selected, selected_id) => {
    let forma = this.state.forma;
    forma["selected"] = selected;
    forma["selected_id"] = selected_id;
    this.setState({ forma: forma });
    this._handle_all_changes();
  };

  // permite manejar los cambios ocurridos en los hijos:
  _handle_picker_change = (ini_date, end_date) => {
    let forma = this.state.forma;
    forma["fecha_inicio"] = ini_date;
    forma["fecha_final"] = end_date;
    this.setState({ forma: forma });
    this._handle_all_changes();
  };

  // actualiza cambios de la forma
  _handle_form_changes = (e, field) => {
    let forma = this.state.forma;
    forma[field] = e.target.value;
    this.setState({ forma: forma });
    this._handle_all_changes();
  };

  // actualiza todos los cambios
  _handle_all_changes = () => {
    this.props.onChange(this.state.forma);
  };

  render() {
    return (
      <div>
        <FilterSTRNodes onChange={this._handle_filter_STRNodes} />
        {this.state.forma.selected === undefined ? (
          <></>
        ) : (
          <Card>
            <Card.Header className="cons-header">
              {this.state.forma.selected["utr_tipo"] === undefined
                ? "Seleccione una UTR"
                : this.state.forma.selected["utr_tipo"]}{" "}
              {this.state.forma.selected["utr_nombre"] === undefined
                ? ""
                : this.state.forma.selected["utr_nombre"]}
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group as={Row}>
                  <Col sm="5">
                    <span className="cons-mandatory">* </span>
                    <Form.Label>
                      Código de consignación (min 4 caracteres):{" "}
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Ingrese código"
                      onChange={(e) =>
                        this._handle_form_changes(e, "no_consignacion")
                      }
                    />
                  </Col>
                  <Col sm="7">
                    <span className="cons-mandatory">* </span>
                    <Form.Label>Fecha de consignación: </Form.Label>
                    <br></br>
                    <DateRangeTime
                      last_month={false}
                      onPickerChange={this._handle_picker_change}
                    ></DateRangeTime>
                  </Col>
                  <Col sm="12">
                    <Form.Label>
                      Descripción corta de la consignación:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese descripción corta"
                      onChange={(e) =>
                        this._handle_form_changes(e, "descripcion_corta")
                      }
                    />
                  </Col>
                  <Col sm="12">
                    <Form.Label>Observaciones: </Form.Label>
                    <Form.Control
                      as="textarea"
                      aria-label="With textarea"
                      placeholder="Ingrese detalles"
                      onChange={(e) => this._handle_form_changes(e, "detalle")}
                    />
                  </Col>
                  <Col>
                    <Form.Label>
                      <span style={{ fontWeight: "bold" }}>Responsable: </span>{" "}
                      {this.state.forma.responsable}
                    </Form.Label>
                  </Col>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        )}
      </div>
    );
  }
}

export default DatosMantenimiento;
