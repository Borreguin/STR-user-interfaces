import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Alert, Button, Card, CardGroup } from "react-bootstrap";
import { SRM_API_URL } from "../../../../../Constantes";
import { UTR } from "../../../manejo-nodos/Types";

type SREliminarUTRProps = {
  selected_nodo_id: string;
  selected_entidad_id: string;
  utrs: Array<UTR>;
  handle_RTUs_changes?: Function;
};

type SREliminarUTRState = {
  loading: boolean;
  success: boolean;
  options: Array<any>;
  msg: string;
};

export class SREliminarUTR extends Component<
  SREliminarUTRProps,
  SREliminarUTRState
> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      success: true,
      options: [],
      msg: "",
    };
  }

  // manejar cambios de UTR:
  _handle_RTUs_changes = (utrs) => {
    if (this.props.handle_RTUs_changes !== undefined) {
      this.props.handle_RTUs_changes(utrs);
    }
  };

  // Convierte la lista de RTUs en un ComboBox
  _rtu_options = () => {
    let options = [];
    this.props.utrs.forEach((utr, ix) => {
      options.push(<option key={ix}>{utr.id_utr}</option>);
    });
    this.setState({ options: options });
  };

  // Maneja la eliminación de una UTR
  _delete_rtu = async (id_utr) => {
    this.setState({ loading: true, msg: "Procesando eliminación..." });
    let path = `${SRM_API_URL}/admin-sRemoto/rtu/${this.props.selected_nodo_id}/${this.props.selected_entidad_id}`;

    await fetch(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_utr: id_utr }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this._handle_RTUs_changes(json.utrs);
        }
        this.setState({ loading: false, success: json.success, msg: json.msg });
      })
      .catch(console.log);
    this._rtu_options();
  };

  // forma para eliminar RTUs
  _render_delete_rtu_form = () => {
    let utrs = [];
    if (this.props.utrs === undefined) {
      return;
    }
    this.props.utrs.forEach((utr, ix) => {
      utrs.push(
        <Card.Header key={ix} className="utr-block">
          <Button
            variant="outline-light"
            className={
              this.state.loading
                ? "src-btn-right src-btn-disabled"
                : "src-btn-right scr-btn-trash"
            }
            onClick={() => this._delete_rtu(utr.id_utr)}
          >
            <FontAwesomeIcon icon={faTrash} inverse size="sm" />
          </Button>
          <div className="utr-label">{utr.utr_tipo}</div>
          <div className="utr-label">
            <b>{utr.utr_nombre}</b>
          </div>
        </Card.Header>,
      );
    });
    return (
      <>
        <CardGroup className="tab-container">{utrs}</CardGroup>
        {this.state.msg.length === 0 ? (
          <></>
        ) : (
          <Alert variant={this.state.success ? "success" : "warning"}>
            {this.state.msg}
          </Alert>
        )}
      </>
    );
  };

  render() {
    return this._render_delete_rtu_form();
  }
}
