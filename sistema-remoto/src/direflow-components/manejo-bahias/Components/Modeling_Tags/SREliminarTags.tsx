import React, { Component } from "react";
import { Alert, Button, Card, Col, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { CSVLink } from "react-csv";
import DataTable from "react-data-table-component";
import * as _ from "lodash";
import { Selected, SelectedID, TAG, UTR } from "../../../Common/GeneralTypes";
import { SRM_API_URL } from "../../../../Constantes";

type SREliminarTagsProps = {
  selected: Selected;
  selected_id: SelectedID;
  handle_RTU_changes?: Function;
  utr: UTR | undefined;
};

type SREliminarTagsState = {
  loading: boolean;
  success: boolean;
  msg: string;
  utr: UTR | undefined;
  filter_tags: Array<TAG>;
  tags_to_delete: Array<string>;
  search: string;
};

// Definición de headers para eliminación:
const normal_columns = [
  {
    name: "Nombre de tag",
    selector: "tag_name",
  },
  {
    name: "Condición de indisponibilidad",
    selector: "filter_expression",
  },
];

export class SREliminarTags extends Component<
  SREliminarTagsProps,
  SREliminarTagsState
> {
  selected_utr: string;
  current_utr: undefined | UTR;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      success: true,
      msg: "",
      utr: undefined,
      filter_tags: [],
      tags_to_delete: [],
      search: "",
    };
    this.selected_utr = "";
    this.current_utr = undefined;
  }

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
    }
    // Cuando se actualiza la UTR referida:
    if (this.current_utr !== this.props.utr) {
      this.current_utr = this.props.utr;
      this.setState({ utr: this.props.utr, loading: false }, () =>
        this._filter_tags(this.state.search)
      );
    }
  }

  // informar que han existido cambios:
  handle_RTU_changes = () => {
    if (this.props.handle_RTU_changes !== undefined) {
      this.props.handle_RTU_changes(this.state.utr);
    }
  };

  // proceder a eliminar en base de datos:
  _delete_tags = () => {
    let path = `${SRM_API_URL}/admin-sRemoto/tags/${this.props.selected_id.nodo}/${this.props.selected_id.entidad}/${this.props.selected_id.utr}`;
     
    if (this.state.tags_to_delete.length === 0) {
      this.setState({ msg: "No hay tags seleccionadas para eliminar" });
      return;
    }
    const confirm = window.confirm(
      "Seguro que desea eliminar las " +
        this.state.tags_to_delete.length +
        " tags seleccionadas?"
    );
    if (confirm) {
      this.setState({
        msg: "Guardando cambios en base de datos",
        success: false,
      });
      let to_send = { tags: this.state.tags_to_delete };
      fetch(path, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(to_send),
      })
        .then((res) => res.json())
        .then((json) => {
          json.msg =
            (json.success
              ? "Operación exitosa en "
              : "Revise el detalle para ") +
            this.props.selected.utr_nombre +
            " " +
            json.msg;
          if (json.success && this.props.utr !== undefined) {
            let utr = _.cloneDeep(this.props.utr);
            utr.tags = json.tags;
            this.setState({ utr: utr, tags_to_delete: [] });
            this._filter_tags(this.state.search);
          }
          this.setState({ success: json.success, msg: json.msg }, () =>
            this.handle_RTU_changes()
          );
        })
        .catch(console.log);
    }
  };

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

  _handleRowSelected = (selectedRowState) => {
    const { selectedCount, selectedRows } = selectedRowState;
    this.setState({ msg: selectedCount + " tags seleccionadas para eliminar" });
    let tags_to_delete = [];
    for (var ix in selectedRows) {
      tags_to_delete.push(selectedRows[ix].tag_name);
    }
    this.setState({ tags_to_delete: tags_to_delete });
  };

  _render_tag_delete = (delete_columns) => {
    return (
      <div>
        <Card className="tab-container">
          <Form.Control
            value={this.state.search}
            type="text"
            onChange={this._filter_tags}
            placeholder="Tag a buscar"
          />
          {this.state.loading ? (
            <></>
          ) : (
            <DataTable
              pagination={true}
              columns={delete_columns}
              data={this.state.filter_tags}
              fixedHeader
              noHeader={true}
              compact={true}
              selectableRows
              onSelectedRowsChange={this._handleRowSelected}
            />
          )}
        </Card>
        <br></br>
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-danger"
              style={{ float: "right" }}
              data-tip={
                "<div>Presione aquí para eliminar las tags seleccionadas</div>"
              }
              data-html={true}
              onClick={this._delete_tags}
            >
              {"Eliminar TAGS seleccionadas en " +
                this.props.selected.utr_nombre}
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
    return (
      <>
        {this._render_tag_delete(normal_columns)}
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
