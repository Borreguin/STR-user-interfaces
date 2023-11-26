import React, { Component } from "react";
import { Alert, Button, Card, Col, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { Selected, SelectedID, TAG, UTR } from "../../../Common/GeneralTypes";
import { SRM_API_URL } from "../../../../Constantes";

type SRCrearTagsProps = {
  selected: Selected;
  selected_id: SelectedID;
  utr: UTR | undefined;
  handle_RTU_changes?: Function;
};

type SRCrearTagsState = {
  loading: boolean;
  success: boolean;
  msg: string;
  tags_to_create: Array<TAG>;
};

const new_tag = {
  tag_name: "",
  filter_expression: "TE.*#ME.*#*.ME#*.TE# DA.*#*.DA#*.INV#INV.*#TE#ME#DA#INV",
  activado: true,
};

export class SRCrearTags extends Component<
  SRCrearTagsProps,
  SRCrearTagsState
> {
  selected_utr: string;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      success: true,
      msg: "",
      tags_to_create: [],
    };
    this.selected_utr = "";
  }

  handle_RTU_changes = (modified_utr) => {
    if (this.props.handle_RTU_changes !== undefined) {
      this.props.handle_RTU_changes(modified_utr);
    }
  };

  // Añadir tag por defecto
  _add_tag = () => {
    let tags_to_create = this.state.tags_to_create;
    // trick in case the array is empty and it was pressed once
    if (this.state.tags_to_create.length === 0) {
      tags_to_create.push({ ...new_tag });
    }
    tags_to_create.push({ ...new_tag });
    this.setState({ tags_to_create: tags_to_create });
  };

  _post_tags = () => {
    let path =
      SRM_API_URL + "/admin-sRemoto/tags/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad +
      "/" +
      this.props.selected_id.utr;

    if (this.state.tags_to_create.length === 0) {
      this.setState({ msg: "No hay tags a ingresar" });
      return;
    }

    this.setState({ msg: "Ingresando Tags en base de datos", success: false });
    let to_send = { tags: this.state.tags_to_create };
    fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to_send),
    })
      .then((res) => res.json())
      .then((json) => {
        json.msg =
          (json.success ? "Operación exitosa en " : "Revise el detalle para ") +
          this.props.selected.utr_nombre +
          " " +
          json.msg;
        if (json.success && this.props.utr !== undefined) {
          let utr = _.cloneDeep(this.props.utr);
          utr.tags = json.tags;
          this.handle_RTU_changes(utr);
        }
        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  // permite editar la selección de activado/desactivado de la tag
  _handle_check_add_tag = (e, ix, field) => {
    let tags_to_create = this.state.tags_to_create;
    // trick in case the array is empty and it was pressed once
    if (this.state.tags_to_create.length === 0) {
      tags_to_create.push({ ...new_tag });
    }
    tags_to_create[ix][field] = !tags_to_create[ix][field];
    this.setState({ tags_to_create: tags_to_create });
  };

  _handle_edit_add_tag = (e, ix, field) => {
    let tags_to_create = this.state.tags_to_create;
    // trick in case the array is empty and it was pressed once
    if (this.state.tags_to_create.length === 0) {
      tags_to_create.push({ ...new_tag });
    }
    tags_to_create[ix][field] = e.target.value;
    this.setState({ tags_to_create: tags_to_create });
  };

  _render_tag_add = () => {
    let tags_to_create = this.state.tags_to_create;
    if (tags_to_create.length === 0) {
      tags_to_create = [new_tag];
    }

    let tags = tags_to_create.map((tag, ix) => (
      <Form.Row key={ix} className="align-items-center">
        <Col sm={1}>
          <Form.Check
            checked={tag.activado}
            onChange={(e) => this._handle_check_add_tag(e, ix, "activado")}
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="Ingrese nombre de la Tag"
            value={tag.tag_name}
            onChange={(e) => this._handle_edit_add_tag(e, ix, "tag_name")}
          />
        </Col>
        <Col sm={4}>
          <Form.Control
            placeholder="Ingrese condición"
            value={tag.filter_expression}
            onChange={(e) =>
              this._handle_edit_add_tag(e, ix, "filter_expression")
            }
          />
        </Col>
      </Form.Row>
    ));

    return (
      <div>
        <Card className="tab-container">
          <br></br>
          <Button
            variant="outline-light"
            className="btn-add-tag"
            disabled={this.state.loading}
            onClick={this._add_tag}
          >
            <FontAwesomeIcon inverse icon={faPlusCircle} size="lg" />
          </Button>
          <br></br>
          <Form>
            <Form.Row>
              <Col sm={1}>
                <Form.Label>Activado</Form.Label>
              </Col>
              <Col>
                <Form.Label>Nombre de Tag</Form.Label>
              </Col>
              <Col sm={4}>
                <Form.Label>Condición de indisponibilidad</Form.Label>
              </Col>
            </Form.Row>
            {tags}
          </Form>
        </Card>
        <br></br>
        <Form.Row>
          <Form.Group id="createTags" as={Col}>
            <Button
              variant="outline-success"
              style={{ float: "right" }}
              data-tip={
                "<div>Presione aquí para crear las tags insertadas</div>"
              }
              data-html={true}
              onClick={this._post_tags}
            >
              {"Crear TAGS en " + this.props.selected.utr_nombre}
            </Button>
            <ReactTooltip />
            <Button
              variant="outline-dark"
              style={{ float: "right", marginRight: "7px" }}
            >
              <CSVLink
                data={this.state.tags_to_create}
                filename={this.props.selected.utr_nombre + ".csv"}
              >
                Descargar CSV
              </CSVLink>
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </div>
    );
  };

  render() {
    return (
      <>
        {this._render_tag_add()}
        {this.state.msg.length === 0 ? (
          <></>
        ) : (
          <Alert variant={this.state.success ? "success" : "warning"}>
            {this.state.msg}
          </Alert>
        )}
      </>
    );
  }
}
