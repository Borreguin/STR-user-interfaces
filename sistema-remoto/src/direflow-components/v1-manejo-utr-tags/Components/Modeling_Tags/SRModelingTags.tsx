import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { SREliminarTags } from "./SREliminarTags";
import { SRCrearTags } from "./SRCrearTags";
import { SREditarTags } from "./SREditarTags";
import { TAG, UTR } from "../../../Common/GeneralTypes";
import { SRM_API_URL } from "../../../../Constantes";

type Selected = {
  entidad_tipo: string;
  entidad_nombre: string;
  utr_nombre: string;
};

type SelectedID = {
  nodo: string;
  entidad: string;
  utr: string;
};

type SRModelingTAGState = {
  success: boolean;
  msg: string;
  loading: boolean;
  search: string;
  filter_tags: Array<TAG>;
  utr: UTR | undefined;
  tags_to_delete: Array<string>;
  tags_to_create: Array<TAG>;
};

type SRModelingTagsProps = {
  selected: Selected;
  selected_id: SelectedID;
};

/* Este componente permite el manejo de tags */
class SRModelingTag extends Component<SRModelingTagsProps, SRModelingTAGState> {
  selected_utr: string;
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      msg: "",
      loading: false,
      search: "",
      filter_tags: [],
      utr: undefined,
      tags_to_delete: [],
      tags_to_create: [],
    };
    this.selected_utr = "";
  }

  componentDidMount = () => {
    this._get_utr();
  };

  componentDidUpdate() {
    // actualizando el controlador de selección de UTRs
    if (this.selected_utr !== this.props.selected_id.utr) {
      this._get_utr();
      this.selected_utr = this.props.selected_id.utr;
    }
  }

  handle_RTU_changes = (modified_UTR: UTR) => {
    this.setState({ utr: modified_UTR });
  };

  _get_utr = async () => {
    this.setState({ utr: undefined });
    if (this.props.selected_id.utr === undefined) {
      return;
    }
    this.setState({
      loading: true,
      success: false,
      msg: "Cargando, espere por favor...",
      filter_tags: [],
    });
    let path =
      SRM_API_URL +
      "/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad +
      "/" +
      this.props.selected_id.utr;

    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({ utr: json.utr });
        }
        this.setState({ msg: json.msg, success: json.success, loading: false });
      })
      .catch(console.log);
  };

  render() {
    return (
      <div className="tab-container">
        <Tabs
          defaultActiveKey="dt-editar-tags"
          id="un-tab-mod"
          transition={false}
        >
          <Tab eventKey="dt-create-tags" title="Crear tags">
            <SRCrearTags
              selected={this.props.selected}
              selected_id={this.props.selected_id}
              utr={this.state.utr}
              handle_RTU_changes={this.handle_RTU_changes}
            ></SRCrearTags>
          </Tab>

          <Tab eventKey="dt-editar-tags" title="Editar tags">
            <SREditarTags
              selected={this.props.selected}
              selected_id={this.props.selected_id}
              utr={this.state.utr}
              handle_RTU_changes={this.handle_RTU_changes}
            ></SREditarTags>
          </Tab>

          <Tab eventKey="dt-delete-tags" title="Eliminar tags">
            <SREliminarTags
              selected={this.props.selected}
              selected_id={this.props.selected_id}
              utr={this.state.utr}
              handle_RTU_changes={this.handle_RTU_changes}
            ></SREliminarTags>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
export default SRModelingTag;
