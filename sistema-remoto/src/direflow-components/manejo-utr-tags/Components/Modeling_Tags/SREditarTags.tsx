import React, { Component } from "react";
import { Alert, Button, Card, Col, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { CSVLink } from "react-csv";
import DataTable from "react-data-table-component";
import * as _ from "lodash";
import { Selected, SelectedID, TAG, UTR } from "../../../Common/GeneralTypes";
import { SRM_API_URL } from "../../../../Constantes";

type SREditarTagsProps = {
  selected: Selected;
  selected_id: SelectedID;
  utr: UTR | undefined;
  handle_RTU_changes?: Function;
};

type SREditarTagsState = {
  loading: boolean;
  success: boolean;
  msg: string;
  search: string;
  filter_tags: Array<TAG>;
  utr: UTR | undefined;
};


export class SREditarTags extends Component<
  SREditarTagsProps,
  SREditarTagsState
> {
  selected_utr: string;
  current_utr: undefined | UTR;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      success: true,
      msg: "",
      filter_tags: [],
      search: "",
      utr: undefined,
    };
    this.selected_utr = "";
    this.current_utr = undefined;
  }

  handle_RTU_changes = () => {
    if (this.props.handle_RTU_changes !== undefined) {
      this.props.handle_RTU_changes(this.state.utr);
    }
  };

  componentDidUpdate() {
    // Cuando es actualizando el controlador de selección de UTRs
    if (this.selected_utr !== this.props.selected_id.utr) {
      this.selected_utr = this.props.selected_id.utr;
      this.setState({ utr: this.props.utr });
      this._filter_tags(this.state.search);
    }
    if (this.props.utr === undefined && this.current_utr !== this.props.utr) {
      this.setState({ loading: true });
      this.current_utr = this.props.utr;
      this._filter_tags(this.state.search);
    }
    // Cuando se actualiza la UTR referida:
    if (this.current_utr !== this.props.utr) {
      this.setState({ loading: true });
      this.current_utr = this.props.utr;
      this.setState({ utr: this.props.utr, loading: false }, () =>
        this._filter_tags(this.state.search)
      );
    }
  }

  _filter_tags = (e) => {
    let to_filter = undefined;
    if (e.target !== undefined) {
      to_filter = e.target.value.toLowerCase();
    } else {
      to_filter = String(e).toLowerCase();
    }
    this.setState({ search: to_filter });
    to_filter = to_filter.split("*").join(".*");

    let filter_tags = [];
    try {
      if (this.state.utr !== undefined) {
        this.state.utr.tags.forEach((tag) => {
          if (tag.tag_name.toLowerCase().match(to_filter) !== null) {
            filter_tags.push(tag);
          }
        });
        filter_tags = filter_tags.sort((a, b) =>
          a.tag_name > b.tag_name ? 1 : -1
        );
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false, filter_tags: filter_tags });
  };

  _edit_tags = () => {
    this.setState({ msg: "Guardando en base de datos", success: false });
    let path =
      SRM_API_URL +
      "/admin-sRemoto/tags/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad +
      "/" +
      this.props.selected_id.utr;
    let edited_tags = [];
    for (var ix in this.state.filter_tags) {
      let tag = this.state.filter_tags[ix];
      if (tag["edited"]) {
        edited_tags.push(tag);
      }
    }
    if (edited_tags.length === 0) {
      this.setState({ msg: "Nada que guardar en base de datos" });
      return;
    }
    let to_send = { tags: edited_tags };
    fetch(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to_send),
    })
      .then((res) => res.json())
      .then((json) => {
        json.msg =
          (json.success ? "Operación exitosa en " : "Revise el detalle para ") +
          this.props.selected.utr_nombre + " " +
          json.msg;
        if (json.success && this.props.utr !== undefined) {
          let utr = _.cloneDeep(this.props.utr);
          utr.tags = json.tags;
          console.log("TEst me", utr);
          this.setState({ utr: utr }, ()=> this.handle_RTU_changes());
          this._filter_tags(this.state.search);
        }
        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  _render_tag_edit = (edit_columns) => {
    return (
      <div>
        <Card className="tab-container">
          <Form.Control
            type="text"
            value={this.state.search}
            onChange={this._filter_tags}
            placeholder="Tag a buscar"
          />
          {this.state.loading ? (
            <></>
          ) : (
            <DataTable
              pagination={true}
              columns={edit_columns}
              data={this.state.filter_tags}
              fixedHeader
              noHeader={true}
              compact={true}
            />
          )}
        </Card>
        <br></br>
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-primary"
              style={{ float: "right" }}
              data-tip={
                "<div>Presione aquí para guardar todos los cambios</div>"
              }
              data-html={true}
              onClick={this._edit_tags}
            >
              {"Editar TAGS en " + this.props.selected.utr_nombre}
            </Button>
            <ReactTooltip />
            <Button
              variant="outline-dark"
              style={{ float: "right", marginRight: "7px" }}
            >
              <CSVLink
                data={this.state.filter_tags}
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
    // Permite edición de boleano:
    let _input_checkbox = (row, field) => {
      return (
        <input
          type="checkbox"
          defaultChecked={row[field]}
          onChange={(e) =>
            _handle_change_in_table(e, row.tag_name, field, true)
          }
        ></input>
      );
    };

    // Permite edición en campos
    let _input_in_table = (row, field) => {
      return (
        <input
          className="table_input"
          defaultValue={row[field]}
          onBlur={(e) => _handle_change_in_table(e, row.tag_name, field)}
        ></input>
      );
    };

    // Actualizar cambios en tabla
    let _handle_change_in_table = (e, tag_name, field, isBoolean = false) => {
      if (
        this.state.filter_tags === undefined ||
        this.state.filter_tags.length === 0
      )
        return;
      let filter_tags = this.state.filter_tags;
      let tag;
      for (var ix in filter_tags) {
        tag = filter_tags[ix];
        if (tag.tag_name === tag_name) {
          if (filter_tags[ix]["edited"] === undefined) {
            filter_tags[ix]["edited"] = true;
            filter_tags[ix]["tag_name_original"] = tag_name;
          }
          if (isBoolean) {
            filter_tags[ix][field] = !filter_tags[ix][field];
          } else {
            filter_tags[ix][field] = e.target.value;
          }
          this.setState({
            filter_tags: filter_tags,
            msg:
              "Tag editada: " +
              filter_tags[ix]["tag_name_original"] +
              ". Pulse 'Editar' para guardar todos los cambios",
          });
          return;
        }
      }
    };

    /// Manejo de la Tabla
    // Definicion de headers para edición:
    const edit_columns = [
      {
        name: "Activado",
        width: "80px",
        //selector: "activado",
        cell: (row) => _input_checkbox(row, "activado"),
      },
      {
        name: "Nombre de tag",
        cell: (row) => _input_in_table(row, "tag_name"),
      },
      {
        name: "Condición de indisponibilidad",
        //selector: "filter_expression",
        cell: (row) => _input_in_table(row, "filter_expression"),
      },
    ];
    // Definición de headers para eliminación:

    /// Fin de Manejo de Tabla
    return (
      <>
        {this._render_tag_edit(edit_columns)}
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
